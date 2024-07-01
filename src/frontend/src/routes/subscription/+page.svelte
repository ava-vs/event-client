<script>
    import { Principal } from "@dfinity/principal";
    import "../../index.scss";
    import { loginII, logout, isAuthenticated, principalId } from "../auth.js";
    import NavMenu from "../Header.svelte";
    import { _client_canister_actor } from "./+page.js";
    import SubForm from "./SubscriptionForm.svelte";

    let client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";

    let loggedIn = false;
    let principal = "";
    isAuthenticated.subscribe((value) => {
        loggedIn = value;
    });

    principalId.subscribe((value) => {
        principal = value;
    });

    // function handleLogin() {
    //     loginII();
    // }

    // function handleLogout() {
    //     logout();
    // }
    // let namespace = "event.hub.balance";
    // let subscriptionInfo = {
    //     namespace: namespace,
    //     subscriber: Principal.fromText(client_canister),
    //     active: true,
    //     filters: [namespace],
    //     messagesReceived: 0,
    //     messagesRequested: 0,
    //     messagesConfirmed: 0,
    // };
</script>

<main style="padding-top: 3em;">
    <NavMenu />
    <SubForm />
    <br />
    <!-- <button class="login" on:click={handleLogin}>
        Login with Internet Identity</button
    > -->
</main>

<style>
    main {
        justify-content: flex-start;
    }

    /* .login,
    .logout {
        background-color: #ee4817;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .login:hover,
    .logout:hover {
        background-color: #d43504;
    } */
</style>
