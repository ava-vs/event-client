// @ts-ignore
export const idlFactory = ({ IDL }) => {
    const ICRC16 = IDL.Rec();
    const Result = IDL.Variant({ 'ok': IDL.Bool, 'err': IDL.Text });
    const PublicationID = IDL.Nat;
    const ICRC16Property = IDL.Record({
        'value': ICRC16,
        'name': IDL.Text,
        'immutable': IDL.Bool,
    });
    ICRC16.fill(
        IDL.Variant({
            'Int': IDL.Int,
            'Map': IDL.Vec(IDL.Tuple(IDL.Text, ICRC16)),
            'Nat': IDL.Nat,
            'Set': IDL.Vec(ICRC16),
            'Nat16': IDL.Nat16,
            'Nat32': IDL.Nat32,
            'Nat64': IDL.Nat64,
            'Blob': IDL.Vec(IDL.Nat8),
            'Bool': IDL.Bool,
            'Int8': IDL.Int8,
            'Nat8': IDL.Nat8,
            'Nats': IDL.Vec(IDL.Nat),
            'Text': IDL.Text,
            'Bytes': IDL.Vec(IDL.Nat8),
            'Int16': IDL.Int16,
            'Int32': IDL.Int32,
            'Int64': IDL.Int64,
            'Option': IDL.Opt(ICRC16),
            'Floats': IDL.Vec(IDL.Float64),
            'Float': IDL.Float64,
            'Principal': IDL.Principal,
            'Array': IDL.Vec(ICRC16),
            'ValueMap': IDL.Vec(IDL.Tuple(ICRC16, ICRC16)),
            'Class': IDL.Vec(ICRC16Property),
        })
    );
    const Map = IDL.Vec(IDL.Tuple(IDL.Text, ICRC16));
    const PublicationInfo = IDL.Record({ 'stats': Map, 'namespace': IDL.Text });
    const ICRC16Map = IDL.Tuple(IDL.Text, ICRC16);
    const EventNotification = IDL.Record({
        'id': IDL.Nat,
        'eventId': IDL.Nat,
        'source': IDL.Principal,
        'data': ICRC16,
        'headers': IDL.Opt(ICRC16Map),
        'preEventId': IDL.Opt(IDL.Nat),
        'filter': IDL.Opt(IDL.Text),
        'timestamp': IDL.Nat,
        'namespace': IDL.Text,
    });
    const Result_3 = IDL.Variant({
        'ok': IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(EventNotification))),
        'err': IDL.Text,
    });
    const Result_2 = IDL.Variant({
        'ok': IDL.Vec(EventNotification),
        'err': IDL.Text,
    });
    const SubscriptionInfo = IDL.Record({
        'filters': IDL.Vec(IDL.Text),
        'active': IDL.Bool,
        'messagesConfirmed': IDL.Nat,
        'messagesReceived': IDL.Nat,
        'messagesRequested': IDL.Nat,
        'subscriber': IDL.Principal,
        'namespace': IDL.Text,
    });
    const Event = IDL.Record({
        'id': IDL.Nat,
        'source': IDL.Principal,
        'data': ICRC16,
        'headers': IDL.Opt(ICRC16Map),
        'timestamp': IDL.Nat,
        'prevId': IDL.Opt(IDL.Nat),
        'namespace': IDL.Text,
    });
    const GenericError = IDL.Record({
        'message': IDL.Text,
        'error_code': IDL.Nat,
    });
    const PublishError = IDL.Variant({
        'GenericError': GenericError,
        'Busy': IDL.Null,
        'ImproperId': IDL.Text,
        'Unauthorized': IDL.Null,
    });
    const Reason = IDL.Text;
    const Result_1 = IDL.Variant({ 'ok': IDL.Nat, 'err': IDL.Text });
    const EthSepoliaService = IDL.Variant({
        'Alchemy': IDL.Null,
        'BlockPi': IDL.Null,
        'PublicNode': IDL.Null,
        'Ankr': IDL.Null,
    });
    const HttpHeader = IDL.Record({ 'value': IDL.Text, 'name': IDL.Text });
    const RpcApi = IDL.Record({
        'url': IDL.Text,
        'headers': IDL.Opt(IDL.Vec(HttpHeader)),
    });
    const EthMainnetService = IDL.Variant({
        'Alchemy': IDL.Null,
        'BlockPi': IDL.Null,
        'Cloudflare': IDL.Null,
        'PublicNode': IDL.Null,
        'Ankr': IDL.Null,
    });
    const RpcService = IDL.Variant({
        'EthSepolia': EthSepoliaService,
        'Custom': RpcApi,
        'EthMainnet': EthMainnetService,
        'Chain': IDL.Nat64,
        'Provider': IDL.Nat64,
    });
    const ICRC72Broadcaster = IDL.Service({
        'addRegisteredNamespace': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
        'confirm_messages': IDL.Func([IDL.Vec(IDL.Nat)], [IDL.Vec(Result)], []),
        'createEvent': IDL.Func(
            [
                IDL.Record({
                    'id': IDL.Nat,
                    'source': IDL.Principal,
                    'data': IDL.Text,
                    'dataType': IDL.Text,
                    'namespace': IDL.Text,
                }),
            ],
            [IDL.Bool],
            [],
        ),
        'createSubscription': IDL.Func(
            [
                IDL.Record({
                    'filters': IDL.Vec(IDL.Text),
                    'active': IDL.Bool,
                    'subscriber': IDL.Principal,
                    'namespace': IDL.Text,
                }),
            ],
            [IDL.Bool],
            [],
        ),
        'getAllStatsById': IDL.Func(
            [PublicationID],
            [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
            [],
        ),
        'getEthLogs': IDL.Func(
            [
                IDL.Text,
                IDL.Text,
                IDL.Nat,
                IDL.Vec(IDL.Text),
                IDL.Text,
                IDL.Nat,
                IDL.Text,
                IDL.Nat,
                IDL.Vec(IDL.Text),
                IDL.Nat,
            ],
            [],
            [],
        ),
        'getPublicationStats': IDL.Func([], [IDL.Vec(PublicationID)], []),
        'getPublications': IDL.Func(
            [IDL.Principal],
            [IDL.Vec(PublicationInfo)],
            [],
        ),
        'getPublishers': IDL.Func([], [IDL.Vec(IDL.Principal)], []),
        'getReceivedMessages': IDL.Func([], [Result_3], []),
        'getReceivedMessagesByNamespace': IDL.Func(
            [IDL.Text],
            [IDL.Vec(EventNotification)],
            [],
        ),
        'getReceivedMessagesBySource': IDL.Func([IDL.Text], [Result_2], []),
        'getRegisteredNamespaces': IDL.Func(
            [],
            [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
            [],
        ),
        'getRegisteredNamespacesByOwner': IDL.Func(
            [IDL.Text],
            [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
            [],
        ),
        'getRegisteredOwnerOfNamespace': IDL.Func(
            [IDL.Text],
            [IDL.Opt(IDL.Text)],
            [],
        ),
        'getSubcriptions': IDL.Func([], [IDL.Vec(SubscriptionInfo)], []),
        'getSubscribersByNamespace': IDL.Func(
            [IDL.Text],
            [IDL.Vec(IDL.Principal)],
            [],
        ),
        'getSubscriptionStats': IDL.Func(
            [IDL.Principal],
            [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)))],
            [],
        ),
        'handleNewEvent': IDL.Func(
            [Event],
            [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Bool))],
            [],
        ),
        'icrc72_handle_notification': IDL.Func(
            [IDL.Vec(EventNotification)],
            [],
            [],
        ),
        'icrc72_handle_notification_trusted': IDL.Func(
            [IDL.Vec(EventNotification)],
            [IDL.Vec(Result)],
            [],
        ),
        'icrc72_publish': IDL.Func(
            [IDL.Vec(Event)],
            [
                IDL.Vec(
                    IDL.Record({
                        'Ok': IDL.Vec(IDL.Nat),
                        'Err': IDL.Vec(PublishError),
                    })
                ),
            ],
            [],
        ),
        'icrc72_register_subscription': IDL.Func(
            [IDL.Vec(SubscriptionInfo)],
            [IDL.Vec(IDL.Tuple(SubscriptionInfo, IDL.Bool))],
            [],
        ),
        'register_publication': IDL.Func(
            [IDL.Principal, IDL.Text],
            [IDL.Bool],
            [],
        ),
        'rejectedResponses': IDL.Func(
            [IDL.Nat, IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat, Reason))],
            [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat, IDL.Bool))],
            [],
        ),
        'removeAllMessages': IDL.Func(
            [IDL.Vec(EventNotification)],
            [Result_1],
            [],
        ),
        'removeAllMessagesBySource': IDL.Func([IDL.Text], [Result], []),
        'removePublication': IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], []),
        'removeRegisteredNamespace': IDL.Func([IDL.Text], [IDL.Bool], []),
        'requestCost': IDL.Func([RpcService, IDL.Text, IDL.Nat], [IDL.Nat], []),
        'subscribe': IDL.Func([SubscriptionInfo], [IDL.Bool], []),
        'unregisterPublisher': IDL.Func([IDL.Principal], [IDL.Bool], []),
        'unsubscribeAll': IDL.Func([IDL.Principal], [], []),
        'unsubscribeByNamespace': IDL.Func([IDL.Principal, IDL.Text], [], []),
    });
    return ICRC72Broadcaster;
};
// @ts-ignore
export const init = ({ IDL }) => { return []; };
