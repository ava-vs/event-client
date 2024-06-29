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

actor class Main() = Self {

    var current_broadcaster = "mmt3g-qiaaa-aaaal-qi6ra-cai";

    private let subManager = SubscriptionManager.SubscriptionManager();
    private let pubManager = Publisher.PublisherManager();
    private var messagesMap = HashMap.HashMap<Principal, [Types.EventNotification]>(10, Principal.equal, Principal.hash);

    //-------------------------------------------------------------------------------------
    // Subcription Part
    public shared func subscribe(subscription : Types.SubscriptionInfo) : async Bool {
        let broadcaster : Types.BroadcasterActor = actor (current_broadcaster);
        let result = await broadcaster.icrc72_register_subscription([subscription]);
        Debug.print("Subscription created with result: " # Nat.toText(result.size()));
        await subManager.icrc72_register_single_subscription(subscription);
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

    public shared (msg) func removeAllMessages(messages : [Types.EventNotification]) : async Result.Result<Nat, Text> {
        if (not Principal.isController(msg.caller)) return #err("Only controller can remove all notifications");
        messagesMap := HashMap.HashMap<Principal, [Types.EventNotification]>(10, Principal.equal, Principal.hash);
        #ok 0;
    };

    // -----------------------------------------------------------------------------------
    // Publication Part
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
            let event : Types.EventRelay = {
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
};
