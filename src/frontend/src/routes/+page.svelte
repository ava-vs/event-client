<script>
  import "../index.scss";
  import NavMenu from "./Header.svelte";
  import back from "$lib/images/back_client.svg";
  import NotificationList from "./NotificationList.svelte";
  import { onMount } from "svelte";
  import { Principal } from "@dfinity/principal";
  import { writable } from "svelte/store";

  let messagesMapStore = writable(new Map());
  const TARGET_PRINCIPAL = process.env.CANISTER_ID_CLIENT; //"mmt3g-qiaaa-aaaal-qi6ra-cai";

  function createSampleEntity(id) {
    return {
      id: BigInt(id),
      eventId: BigInt(1000 + id),
      preEventId: null,
      timestamp: BigInt(Date.now()),
      namespace: "event.profile.update",
      data: {
        "#Class": [
          { key: "name", value: { "#Text": `Пользователь ${id}` } },
          { key: "age", value: { "#Nat": BigInt(25 + (id % 50)) } },
          { key: "isActive", value: { "#Bool": true } },
        ],
      },
      source: Principal.fromText(`aaaaa-aa`),
      headers: {
        "#Map": [
          ["Content-Type", { "#Text": "application/json" }],
          ["X-Request-ID", { "#Text": `req-${id}` }],
        ],
      },
      filter: "user.profile.*",
    };
  }

  function initializeMessagesMap() {
    const frontend_canister = process.env.CANISTER_ID_FRONTEND;
    const principals = [TARGET_PRINCIPAL, frontend_canister];

    principals.forEach((principal, index) => {
      const notifications = [
        createSampleEntity(index * 100 + 1),
        createSampleEntity(index * 100 + 2),
        createSampleEntity(index * 100 + 3),
      ];
      $messagesMapStore.set(principal, notifications);
    });
  }
  let entity = {
    id: 1234n,
    eventId: 5678n,
    preEventId: null,
    timestamp: 1625097600000n, // 1 июля 2021 года, 00:00:00 UTC
    namespace: "event.hub.update",
    data: {
      "#Class": [
        { key: "name", value: { "#Text": "Иван Петров" } },
        { key: "age", value: { "#Nat": 30n } },
        { key: "isActive", value: { "#Bool": true } },
        {
          key: "interests",
          value: {
            "#Array": [
              { "#Text": "программирование" },
              { "#Text": "путешествия" },
              { "#Text": "фотография" },
            ],
          },
        },
      ],
    },
    source: Principal.fromText(TARGET_PRINCIPAL),
    headers: {
      "#Map": [
        ["Content-Type", { "#Text": "application/json" }],
        ["X-Request-ID", { "#Text": "abcdef123456" }],
      ],
    },
    filter: "user.profile.*",
  };

  onMount(() => {
    console.log("onMount start");
    messagesMapStore.update((map) => {
      map.set(TARGET_PRINCIPAL, [entity]);
      return map;
    });
    initializeMessagesMap();
    console.log("messagesMap after init:", $messagesMapStore);
  });

  function formatTimestamp(timestamp) {
    return new Date(Number(timestamp)).toLocaleString();
  }

  function renderICRC16(data) {
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return `[${data.map(renderICRC16).join(", ")}]`;
      } else if (data instanceof Uint8Array) {
        return `Blob(${data.length} bytes)`;
      } else if (data.constructor === Object) {
        return JSON.stringify(data, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        );
      }
    }
    return typeof data === "bigint" ? data.toString() : String(data);
  }

  $: console.log("Reactive messagesMap size:", $messagesMapStore.size);

  async function handleNotifications() {
    let result = await _client_canister_actor
      .getNotificationsByUser(TARGET_PRINCIPAL)
      .then((res) => {
        console.log("res", res);
        messagesMapStore.update((map) => {
          map.set(TARGET_PRINCIPAL, res);
          return map;
        });
      });
  }
</script>

<svelte:head>
  <title>Event Hub Client</title>
  <meta name="description" content="Client for ICP Event Messagages" />
</svelte:head>
<main
  style="padding-top: 3em; background-image: url({back}); background-size: cover; background-repeat: no-repeat; background-position: center center; height: 100vh; width: 100vw; overflow-x: hidden;"
>
  <NavMenu />
  <NotificationList />
</main>
