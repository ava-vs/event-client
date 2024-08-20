import Publisher "./publications/PublisherManager";
import SubscriptionManager "./subscriptions/SubscriptionManager";
import Types "ICRC72Types";
import Utils "Utils";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";

actor class Main() = Self {

    var current_broadcaster = "rvrj4-pyaaa-aaaal-ajluq-cai";
    var dao_canister_id : Text = "k5yym-uqaaa-aaaal-ajoyq-cai";

    private let subManager = SubscriptionManager.SubscriptionManager();
    private let pubManager = Publisher.PublisherManager();
    private var messagesMap = HashMap.HashMap<Principal, [Types.EventNotification]>(10, Principal.equal, Principal.hash);

    stable var messagesStore : [(Principal, [Types.EventNotification])] = [];

    system func preupgrade() {
        messagesStore := Iter.toArray(messagesMap.entries());
        // TODO other stats (events, etc)
    };

    system func postupgrade() {
        for (entry in messagesStore.vals()) {
            messagesMap.put(entry.0, entry.1);
        };
        messagesStore := [];
    };
    //-------------------------------------------------------------------------------------
    // Subcription Part
    public shared func subscribe(subscription : Types.SubscriptionInfo) : async Bool {

        let result = await subManager.icrc72_register_single_subscription(current_broadcaster, subscription);
        result.0;
    };

    public func getSubscriptions() : async [Types.SubscriptionInfo] {
        await subManager.getSubscriptions();
    };

    public func unsubscribeAll(subscriber : Principal) : async () {
        await subManager.unsubscribeAll(subscriber);
    };

    public func unsubscribeByNamespace(subscriber : Principal, namespace : Text) : async () {
        await subManager.unsubscribeByNamespace(subscriber, namespace);
    };

    public func icrc72_handle_notification(messages : [Types.EventNotification]) : async () {
        for (message in messages.vals()) {
            // eventHubBalance namespace handling
            let eventHubBalance = "event.hub.balance";
            if (message.namespace == eventHubBalance) {
                switch (message.data) {
                    case (#Map(data)) {
                        var newBalance : ?Nat = null;
                        var user : ?Text = null;

                        for ((key, value) in data.vals()) {
                            switch (key, value) {
                                case ("balance", #Nat(balance)) newBalance := ?balance;
                                case ("user", #Text(userText)) user := ?userText;
                                case _ {}; // Ignore other keys
                            };
                        };

                        switch (newBalance, user) {
                            case (?balance, ?userText) {
                                if (userText == Principal.toText(Principal.fromActor(Self))) {
                                    ignore await updateBalance(Principal.fromActor(Self), balance);
                                };
                            };
                            case _ {
                                // Missing balance or user data in the message
                                Debug.print("Error: Missing balance or user data in the message");
                            };
                        };
                    };
                    case _ {
                        // Incorrect data format
                        Debug.print("Error: Incorrect data format in the message");
                    };
                };
            };

            let existingMessage = messagesMap.get(message.source);
            switch (existingMessage) {
                case (null) messagesMap.put(message.source, [message]);
                case (?m) {
                    let newMessages = Utils.pushIntoArray<Types.EventNotification>(message, m);
                    messagesMap.put(message.source, newMessages);
                };
            };
        };
    };

    public func changeBroadcaster(broadcaster : Text) : async Result.Result<Text, Text> {
        current_broadcaster := broadcaster;
        #ok current_broadcaster;
    };

    // Balance

    private func updateBalance(user : Principal, balance : Nat) : async Result.Result<Nat, Text> {
        // ignore await balanceManager.updateBalance(user, balance);
        // TODO
        #ok(1);
    };

    public func icrc72_handle_notification_trusted(messages : [Types.EventNotification]) : async [Result.Result<Bool, Text>] {
        for (message in messages.vals()) {
            let existingMessage = messagesMap.get(message.source);
            switch (existingMessage) {
                case (null) messagesMap.put(message.source, [message]);
                case (?m) {
                    let newMessages = Utils.pushIntoArray(message, m);
                    messagesMap.put(message.source, newMessages);
                };
            };
        };
        Array.map<Types.EventNotification, Result.Result<Bool, Text>>(
            messages,
            func(message) : Result.Result<Bool, Text> {
                #ok true;
            },
        );
    };

    public shared (msg) func getReceivedMessages() : async Result.Result<[(Principal, [Types.EventNotification])], Text> {
        // if (not Principal.isController(msg.caller)) return #err("Only controller can call this method");
        let res = Iter.toArray(messagesMap.entries());
        #ok res;
    };

    public shared (msg) func getNotificationsByUser(user : Text) : async (Text, [Types.EventNotification]) {
        let userPrincipal = Principal.fromText(user);
        let messages = messagesMap.get(userPrincipal);
        let res = switch (messages) {
            case (null) (user, []);
            case (?m) (user, m);
        };
        res;
    };

    public shared (msg) func getReceivedMessagesBySource(source : Text) : async Result.Result<[Types.EventNotification], Text> {
        // if (not Principal.isController(msg.caller)) return #err("Only controller can call this method");

        let publisher = Principal.fromText(source);
        let messages = messagesMap.get(publisher);
        switch (messages) {
            case (null) #ok([]);
            case (?m) #ok m;
        };
    };

    public func getReceivedMessagesByNamespace(namespace : Text) : async [Types.EventNotification] {
        var resultMap = HashMap.HashMap<Types.EventNotification, Null>(
            0,
            func(x : Types.EventNotification, y : Types.EventNotification) : Bool {
                x.timestamp == y.timestamp and x.namespace == y.namespace
            },
            func(x : Types.EventNotification) : Hash.Hash {
                let namespaceHash = Text.hash(namespace);
                let timestampHash = Hash.hash(x.timestamp);
                return namespaceHash ^ timestampHash;
            },
        );
        for (messages in messagesMap.vals()) {
            for (message in messages.vals()) {
                if (message.namespace == namespace) {
                    resultMap.put(message, null);
                };
            };
        };

        Iter.toArray(resultMap.keys());
    };

    public shared (msg) func removeAllMessages() : async Result.Result<Nat, Text> {
        // if (not Principal.isController(msg.caller)) return #err("Only controller can remove all notifications");
        let size = messagesMap.size();
        messagesMap := HashMap.HashMap<Principal, [Types.EventNotification]>(10, Principal.equal, Principal.hash);
        #ok size;
    };

    public shared (msg) func removeMessagesById(ids : [Nat]) : async Result.Result<Nat, Text> {
        var removedCount = 0;

        label a for (id in ids.vals()) {
            for ((principal, messages) in messagesMap.entries()) {
                // TODO if (not (principal == msg.caller)) { continue a };
                let updatedMessages = Array.filter(
                    messages,
                    func(notification : Types.EventNotification) : Bool {
                        if (notification.id == id) {
                            removedCount += 1;
                            return false; // Remove this message
                        };
                        return true; // Keep this message
                    },
                );

                if (updatedMessages.size() < messages.size()) {
                    // Update the messagesMap only if we removed a message
                    messagesMap.put(principal, updatedMessages);
                };
            };
        };

        #ok(removedCount);
    };

    // -----------------------------------------------------------------------------------
    // Publication Part

    public shared func publish(event : Types.Event) : async Result.Result<Nat, Text> {
        let broadcaster : Types.BroadcasterActor = actor (current_broadcaster);
        // check publication
        let existPublication = pubManager.publications.get(event.source);
        switch (existPublication) {
            case (null) {
                let publication : Types.PublicationInfo = {
                    namespace = event.namespace;
                    // TODO handle stats
                    stats = [("messagesSent", #Nat(0))];
                };
                pubManager.publications.put(event.source, [publication]);
            };
            case (?publication) {
                // Check if the namespace already exists
                let existingNamespace = Array.find<Types.PublicationInfo>(
                    publication,
                    func(p) { p.namespace == event.namespace },
                );

                switch (existingNamespace) {
                    case (null) {
                        // If namespace doesn't exist, add a new publication
                        let newPublication : Types.PublicationInfo = {
                            namespace = event.namespace;
                            stats = [("messagesSent", #Nat(1))];
                        };
                        pubManager.publications.put(event.source, Array.append(publication, [newPublication]));
                    };
                    case (?existingPub) {
                        // If namespace exists, update the stats
                        let updatedStats = Array.map<(Text, Types.ICRC16), (Text, Types.ICRC16)>(
                            existingPub.stats,
                            func((key, value)) {
                                if (key == "messagesSent") {
                                    switch (value) {
                                        case (#Nat(count)) {
                                            return (key, #Nat(count + 1));
                                        };
                                        case (_) {
                                            return (key, value);
                                        };
                                    };
                                } else {
                                    return (key, value);
                                };
                            },
                        );
                        let updatedPublication = {
                            namespace = existingPub.namespace;
                            stats = updatedStats;
                        };
                        let updatedPublications = Array.map<Types.PublicationInfo, Types.PublicationInfo>(
                            publication,
                            func(pub) {
                                if (pub.namespace == event.namespace) {
                                    updatedPublication;
                                } else {
                                    pub;
                                };
                            },
                        );
                        pubManager.publications.put(event.source, updatedPublications);
                    };
                };
            };
        };

        // Now proceed with publishing the event
        try {
            let result : [{
                Err : [Types.PublishError];
                Ok : [Nat];
            }] = await broadcaster.icrc72_publish([event]);
            if (result.size() > 0) {
                let ids = result[0].Ok;
                let errors = result[0].Err;
                if (errors.size() > 0) {
                    return #err("Error publishing event: " # debug_show (errors));
                } else {
                    // Save the event
                    pubManager.saveEvent(event);
                    return #ok(ids[0]);
                };
            };
            return #err("Error publishing event: no result");
        } catch (error) {
            #err("Error calling broadcaster: " # Error.message(error));
        };
    };

    type FrontEvent = {
        id : Nat;
        prevId : Nat;
        timestamp : Nat;
        namespace : Text;
        source : Principal;
        dataType : Text;
        dataValue : Text;
        headers : [{
            fieldName : Text;
            fieldType : Text;
            fieldValue : Text;
        }];
    };
    public func frontEvent_publish(events : [FrontEvent]) : async [{
        Ok : [Nat];
        Err : [Types.PublishError];
    }] {
        // TODO check if event is valid
        // TODO check if event is already published
        // TODO check if event is expired
        // TODO check if event is already in the queue
        let broadcaster : Types.BroadcasterActor = actor (current_broadcaster);
        let result = Buffer.Buffer<{ Ok : [Nat]; Err : [Types.PublishError] }>(events.size());
        for (frontevent in events.vals()) {
            let data = convertData(frontevent.dataType, frontevent.dataValue);
            let converted_headers = convertHeaders(frontevent.headers);
            let event : Types.Event = {
                id = frontevent.id;
                prevId = ?frontevent.prevId;
                timestamp = frontevent.timestamp;
                namespace = frontevent.namespace;
                source = frontevent.source;
                data = data;
                headers = ?converted_headers;
            };
            pubManager.saveEvent(event);

            let r = await broadcaster.icrc72_publish([event]);
            for (res in r.vals()) {
                result.add(res);
            };
        };
        Buffer.toArray(result);
    };

    func convertData(dataType : Text, dataValue : Text) : Types.ICRC16 {
        switch (dataType) {
            case ("Text") return #Text(dataValue);
            case ("Nat") return #Nat(Option.get(Nat.fromText(dataValue), 0));
            case ("Bool") {
                let res : Bool = switch (Text.toLowercase(dataValue)) {
                    case "true" { true };
                    case "false" { false };
                    case _ { false };
                };
                return #Bool(res);
            };
            // case ("Array") return #Array(dataValue);

            case _ return #Text(dataValue);
        };
    };

    func convertHeaders(headers : [{ fieldName : Text; fieldType : Text; fieldValue : Text }]) : Types.ICRC16Map {

        let result = HashMap.HashMap<Text, Types.ICRC16>(headers.size(), Text.equal, Text.hash);
        for (header in headers.vals()) {
            let fieldValue = convertData(header.fieldType, header.fieldValue);
            result.put(header.fieldName, fieldValue);
        };
        return Iter.toArray(result.entries());
    };

    //---------------------------------------------------------------
    // DAO part
    type DaoActor = actor {
        vote : (proposalId : Nat, voter : Text, vote : Bool) -> async Result.Result<(), VoteError>;
        createProposal : (proposal : ProposalContent) -> async Result.Result<Nat, CreateProposalError>;
    };

    public type VoteError = {
        #notAuthorized;
        #alreadyVoted;
        #votingClosed;
        #proposalNotFound;
        // #insufficientVotingPower;
        #wrongVotingPower;
    };

    public func vote(proposalId : Nat, voterId : Text, vote : Bool) : async Result.Result<(), VoteError> {
        let dao : DaoActor = actor (dao_canister_id);
        await dao.vote(proposalId, voterId, vote);
    };

    type ProposalContent = {
        #codeUpdate : {
            description : Text;
            wasmModule : Blob;
        };
        #transferFunds : {
            amount : Nat;
            recipient : Principal;
            purpose : {
                #toFund : Text; // e.g., "Rewards Fund", "Development Fund"
                #grantPayment : Text; // Description or ID of the grant
                #serviceBill : Text; // Description of the service or bill ID
            };
        };
        #adjustParameters : {
            parameterName : Text;
            newValue : Text;
            description : Text;
        };
        #other : {
            description : Text;
            action : Text;
        };
    };

    type Member = {
        votingPower : Nat;
        id : Principal;
    };

    type CreateProposalError = {
        #notAuthorized;
        #invalid : [Text];
    };

    public func createProposal<system>(
        content : ProposalContent
    ) : async Result.Result<Nat, CreateProposalError> {
        let dao : DaoActor = actor (dao_canister_id);
        await dao.createProposal(content);
    };

    public func setDao(id : Text) : async Bool {
        dao_canister_id := id;
        true;
    };
};
