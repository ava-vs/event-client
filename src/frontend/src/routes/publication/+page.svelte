<script>
    import { Principal } from "@dfinity/principal";
    import "../../index.scss";
    import { loginII, logout, isAuthenticated, principalId } from "../auth.js";
    import NavMenu from "../Header.svelte";
    import { _client_canister_actor } from "../+page.js";
    import PubForm from "./PubForm.svelte";

    let namespace = "event.hub.balance";
    let client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";

    let loggedIn = false;
    let principal = "";

    isAuthenticated.subscribe((value) => {
        loggedIn = value;
    });

    principalId.subscribe((value) => {
        principal = value;
    });

    function handleLogin() {
        loginII();
    }

    function handleLogout() {
        logout();
    }
    let id = 0;
    let prevId = null;
    let timestamp = Date.now();
    let data = "{}";
    let headers = "";
    let includePrevId = false;
    let includeHeaders = false;

    async function handleSubmit() {
        const event = {
            id: Number(id),
            prevId: includePrevId ? Number(prevId) : null,
            timestamp: Number(timestamp),
            namespace: namespace,
            source: Principal.fromText(client_canister),
            data: JSON.parse(data),
            headers: includeHeaders ? JSON.parse(headers) : null,
        };
        return _client_canister_actor
            .icrc72_publish([event])
            .then((publication) => {
                console.log("publication created: ", publication);
                return publication;
            });
    }
</script>

<main style="padding-top: 3em;">
    <NavMenu />
    <PubForm />

    <div class="text-column">
        <!-- {#if loggedIn} -->
        <!-- <div>
            <br />
            Hi, {principal}!
            <br />
            <form on:submit|preventDefault={handleSubmit}>
                <div>
                    <label for="id">ID:</label>
                    <input id="id" type="number" bind:value={id} required />
                </div>

                <div>
                    <label for="includePrevId">Include Previous ID:</label>
                    <input
                        id="includePrevId"
                        type="checkbox"
                        bind:checked={includePrevId}
                    />
                </div>

                {#if includePrevId}
                    <div>
                        <label for="prevId">Previous ID:</label>
                        <input id="prevId" type="number" bind:value={prevId} />
                    </div>
                {/if}

                <div>
                    <label for="timestamp">Timestamp:</label>
                    <input
                        id="timestamp"
                        type="number"
                        bind:value={timestamp}
                        required
                    />
                </div>

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
                    <label for="client_canister">Client Canister:</label>
                    <input
                        id="client_canister"
                        type="text"
                        bind:value={client_canister}
                        required
                    />
                </div>

                <div>
                    <label for="data">Data (JSON):</label>
                    <textarea id="data" bind:value={data} required></textarea>
                </div>

                <div>
                    <label for="includeHeaders">Include Headers:</label>
                    <input
                        id="includeHeaders"
                        type="checkbox"
                        bind:checked={includeHeaders}
                    />
                </div>

                {#if includeHeaders}
                    <div>
                        <label for="headers">Headers (JSON):</label>
                        <textarea id="headers" bind:value={headers}></textarea>
                    </div>
                {/if}

                <button type="submit">Submit</button>
            </form>
            <br />
            <button class="logout" on:click={handleLogout}> Logout</button>
        </div> -->
        <!-- {:else} -->
        <button class="login" on:click={handleLogin}>
            Login with Internet Identity</button
        >
        <!-- {/if} -->
        <p />
    </div>
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

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
    }

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    input[type="text"],
    input[type="number"],
    textarea {
        width: 60%;
    }

    textarea {
        height: 100px;
    }

    button {
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
