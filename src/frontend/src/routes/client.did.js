export const idlFactory = ({ IDL }) => {
  const ICRC16 = IDL.Rec();
  const Result_4 = IDL.Variant({ 'ok': IDL.Text, 'err': IDL.Text });
  const FrontEvent = IDL.Record({
    'id': IDL.Nat,
    'source': IDL.Principal,
    'headers': IDL.Vec(
      IDL.Record({
        'fieldName': IDL.Text,
        'fieldType': IDL.Text,
        'fieldValue': IDL.Text,
      }
      )
    ),
    'dataValue': IDL.Text,
    'dataType': IDL.Text,
    'timestamp': IDL.Nat,
    'prevId': IDL.Nat,
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
  const ICRC16Map = IDL.Vec(IDL.Tuple(IDL.Text, ICRC16));
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
  const Result_1 = IDL.Variant({ 'ok': IDL.Bool, 'err': IDL.Text });
  const Result = IDL.Variant({ 'ok': IDL.Nat, 'err': IDL.Text });
  const SubscriptionInfo = IDL.Record({
    'filters': IDL.Vec(IDL.Text),
    'active': IDL.Bool,
    'messagesConfirmed': IDL.Nat,
    'messagesReceived': IDL.Nat,
    'messagesRequested': IDL.Nat,
    'subscriber': IDL.Principal,
    'namespace': IDL.Text,
  });
  const Main = IDL.Service({
    'changeBroadcaster': IDL.Func([IDL.Text], [Result_4], []),
    'frontEvent_publish': IDL.Func(
      [IDL.Vec(FrontEvent)],
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
    'getNotificationsByUser': IDL.Func(
      [IDL.Text],
      [IDL.Text, IDL.Vec(EventNotification)],
      [],
    ),
    'getReceivedMessages': IDL.Func([], [Result_3], []),
    'getReceivedMessagesByNamespace': IDL.Func(
      [IDL.Text],
      [IDL.Vec(EventNotification)],
      [],
    ),
    'getReceivedMessagesBySource': IDL.Func([IDL.Text], [Result_2], []),
    'icrc72_handle_notification': IDL.Func(
      [IDL.Vec(EventNotification)],
      [],
      [],
    ),
    'icrc72_handle_notification_trusted': IDL.Func(
      [IDL.Vec(EventNotification)],
      [IDL.Vec(Result_1)],
      [],
    ),
    'removeAllMessages': IDL.Func([IDL.Vec(EventNotification)], [Result], []),
    'subscribe': IDL.Func([SubscriptionInfo], [IDL.Bool], []),
    'unsubscribeAll': IDL.Func([IDL.Principal], [], []),
    'unsubscribeByNamespace': IDL.Func([IDL.Principal, IDL.Text], [], []),
  });
  return Main;
};
export const init = ({ IDL }) => { return []; };
