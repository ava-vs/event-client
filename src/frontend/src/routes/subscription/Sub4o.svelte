<script>
    import connector from "$lib/images/Connector.svg";
    import { _client_canister_actor } from "./+page.js";
    import { loginII, logout, isAuthenticated, principalId } from "../auth.js";
    import { Principal } from "@dfinity/principal";
    import "../../index.scss";

    let client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";

    let loggedIn = false;

    isAuthenticated.subscribe((value) => {
        loggedIn = value;
    });
    function handleLogin() {
        loginII();
    }

    function handleLogout() {
        logout();
    }
    let subscriber = "mlss5-5qaaa...";
    let filter = "Filter 1";
    let namespace = "event.hub.balance";
    let subscriptionInfo = {
        namespace: namespace,
        subscriber: Principal.fromText(client_canister),
        active: true,
        filters: [namespace],
        messagesReceived: 0,
        messagesRequested: 0,
        messagesConfirmed: 0,
    };

    async function handleSubmit() {
        console.log("Submitted:", { subscriber, namespace, filter });
        const subscription =
            await _client_canister_actor.subscribe(subscriptionInfo);
        console.log("Subscription created: ", subscription);
        return subscription;
    }
</script>

<main>
    <!-- <NavMenu /> -->
    <!-- {#if loggedIn} -->

    <div class="subscription-form">
        <div class="input-group">
            <label for="subscriber">Subscriber</label>
            <input type="text" id="subscriber" bind:value={subscriber} />
        </div>
        <div class="connector">
            <img src={connector} alt="connector" />
        </div>
        <div class="input-group">
            <label for="namespace">Namespace</label>
            <input type="text" id="namespace" bind:value={namespace} />
        </div>
        <div class="connector">
            <img src={connector} alt="connector" />
        </div>
        <div class="input-group">
            <label for="filter">Filter</label>
            <input type="text" id="filter" bind:value={filter} />
        </div>
        <button on:click={handleSubmit}>Submit</button>
    </div>
    <!-- {:else} -->
    <!-- <button class="login" on:click={handleLogin}>
        Login with Internet Identity</button -->
    <!-- > -->
    <!-- {/if} -->
</main>
