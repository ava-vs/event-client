<script>
  import "../index.scss";
  import NavMenu from "./Header.svelte";
  import back from "$lib/images/back_client.svg";
  import NotificationList from "./NotificationList.svelte";
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
