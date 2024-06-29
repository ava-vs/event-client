<script>
    import { Principal } from "@dfinity/principal";
    import "../../index.scss";
    import { loginII, logout, isAuthenticated, principalId } from "../auth.js";
    import NavMenu from "../Header.svelte";
    import { _client_canister_actor } from "./+page.js";
    import SubForm from "./SubForm.svelte";
    import Sub4o from "./Sub4o.svelte";

    let client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";

    let loggedIn = false;
    let principal = "";
    const menuItems = [
        { name: "Your Notifications", href: "/" },
        { name: "Subscription", href: "/subscription" },
        { name: "Publication", href: "/publication" },
    ];
    isAuthenticated.subscribe((value) => {
        loggedIn = value;
    });

    principalId.subscribe((value) => {
        principal = value;
        // if (principal) {
        //     getBalance(principal).then((balance) => {
        //         userBalance = balance;
        //     });
        //     getSoulboundBadge(principal).then((badge) => {
        //         badgeReceipt = badge;
        //     });
        // }
    });

    function handleLogin() {
        loginII();
    }

    function handleLogout() {
        logout();
    }
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

    async function handleSubsribe() {
        return _client_canister_actor
            .subscribe(subscriptionInfo)
            .then((subscription) => {
                console.log("Subscription created: ", subscription);
                return subscription;
            });
    }
</script>

<main style="padding-top: 3em;">
    <NavMenu />
    <!-- <SubForm /> -->
    <Sub4o />
    <!-- <div class="text-column">
        {#if loggedIn} -->
    <!-- <div>
            <form on:submit|preventDefault={handleSubsribe}>
                <div>
                    <label for="namespace">Namespace:</label>
                    <input
                        id="namespace"
                        type="text"
                        bind:value={namespace}
                        required
                    />
                </div>

                <div>
                    <label for="client_canister">Subscriber:</label>
                    <input
                        id="client_canister"
                        type="text"
                        bind:value={subscriptionInfo.subscriber}
                        required
                    />
                </div>

                <div>
                    <label for="active">Active:</label>
                    <input
                        id="active"
                        type="checkbox"
                        bind:checked={subscriptionInfo.active}
                    />
                </div>

                <div>
                    <label for="filters">Filters (comma-separated):</label>
                    <input
                        id="filters"
                        type="text"
                        bind:value={subscriptionInfo.filters}
                        required
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
            <button class="logout" on:click={handleLogout}> Logout</button>
        </div> -->
    <!-- {:else} -->
    <button class="login" on:click={handleLogin}>
        Login with Internet Identity</button
    >
    <!-- {/if} -->
    <!-- <p />
    </div> -->
</main>

<style>
    main {
        justify-content: flex-start;
    }

    .login,
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
    }

    /* form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 300px;
        margin: 0 auto;
    }

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    input[type="text"] {
        width: 60%;
    } */
</style>
