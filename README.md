# Motoko Event Hub / Attention DAO Client

## Summary:

**Event-Driven Communication on the Internet Computer**

**Event Hub** is a [draft ICRC72](https://github.com/icdevs/ICEventsWG/blob/main/Meetings/20240515/icrc72draft.md) Motoko pub-sub pattern implementation for managing events, subscribers, and sending events to subscribers.

**Attention DAO** features a decentralized architecture, preserving canister isolation for enhanced security and scalability.

**Event Hub** also provides interoperability with Ethereum RPC methods.
 
## Overview:
![Event_Hub](https://github.com/ava-vs/event_hub/assets/30374212/e29abbbf-2d5f-4bdf-a981-4403f8aedbac)

### Simple Use Case
![Oneshot_GameEvent](https://github.com/ava-vs/event-client/assets/30374212/e86f5124-f77f-45e7-abe7-a308a5f1a072)


## Features:
- Subscriber Management: Functions for subscribing (subscribe) and unsubscribing (unsubscribe) to events.
- Publication Managment: Register a new publication and publish events to subscribers.
- Distribute messages to subscribers vit Event Hub Broadcaster

## Usage

Subscriptions and publications can be made through the Event Hub Client front-end or via inter-canister calls to the Client back-end.

## Deployment

### Mainnet
```bash
cd event_client
dfx deploy --ic
```

#### Local
```bash
dfx start --background

dfx deploy
```

### Contributing
Contributions are welcome. Please submit a pull request or open an issue to discuss your ideas.

### License
This project is licensed under the terms of the MIT license.

### Links

- Wiki 
