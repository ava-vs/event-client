<script>
    import connector from "$lib/images/Connector.svg";
    import { _client_canister_actor } from "./+page.js";
    import { loginII, logout, isAuthenticated, principalId } from "../auth.js";
    import NavMenu from "../Header.svelte";
    import { Principal } from "@dfinity/principal";

    let client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";

    let loggedIn = false;
    let principal = "";

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

    function handleSubmit() {
        console.log("Submitted:", { subscriber, namespace, filter });
        return _client_canister_actor
            .subscribe(subscriptionInfo)
            .then((subscription) => {
                console.log("Subscription created: ", subscription);
                return subscription;
            });
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

<style>
    @import url("https://fonts.googleapis.com/css2?family=Krona+One&display=swap");

    .subscription-form {
        font-family: "Krona One", Arial, sans-serif;
        max-width: 240px;
        margin: 0 auto;
        padding: 20px;
        padding-top: 30px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .input-group {
        position: relative;
        margin-bottom: 20px;
        /* padding-top: 5px; */
    }

    label {
        position: absolute;
        font-size: 1rem;
        left: 0;
        right: 0;
        top: -20px;
        text-align: center;
        background-color: white;
        padding: 0 5px;
        color: #0f053a;
        z-index: 1;
    }

    input {
        width: 90%;
        padding: 10px;
        border: 2px solid #7e7b8e;
        border-radius: 10px;
        font-size: 14px;
        font-family: "Krona One", sans-serif;
        text-align: center;
        color: #7e7b8e;
    }

    input:focus {
        outline: none;
        border-color: #007bff;
    }

    button {
        width: 40%;
        font-family: "Krona One", sans-serif;
        padding: 10px;
        background-color: #fbfcfd;
        color: black;
        border: solid 2px #007bff;
        border-radius: 10px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-left: 30%;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
