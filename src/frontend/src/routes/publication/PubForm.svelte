<script>
    import connector from "$lib/images/Connector.svg";
    import { _client_canister_actor } from "./+page.js";
    import { loginII, logout, isAuthenticated, principalId } from "../auth.js";
    import NavMenu from "../Header.svelte";
    import { Principal } from "@dfinity/principal";

    let client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";
    let loggedIn = false;
    let prevId = null;
    let headers = "";
    let includePrevId = false;
    let includeHeaders = false;
    let id = 0;
    let namespace = "event.hub.balance";
    let timestamp = Date.now();
    let data = "{}";
    let dataType = "Text";
    let dataValue = "";

    function formatICRC16Data(type, value) {
        switch (type) {
            case "Int":
                return `#Int(${parseInt(value)})`;
            case "Text":
                return `#Text("${value}")`;
            case "Bool":
                return `#Bool(${value.toLowerCase() === "true"})`;
            // Добавьте другие типы по необходимости
            default:
                return `#${type}(${value})`;
        }
    }

    isAuthenticated.subscribe((value) => {
        loggedIn = value;
    });

    async function handleSubmit() {
        const event = {
            id: Number(id),
            prevId: includePrevId ? Number(prevId) : null,
            timestamp: Number(timestamp),
            namespace: namespace,
            source: Principal.fromText(client_canister),
            data: formatICRC16Data(dataType, dataValue),
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

<main>
    <div class="event-form">
        <div class="input-group">
            <label for="id">ID</label>
            <input type="number" id="id" bind:value={id} />
        </div>
        <div class="connector">
            <img src={connector} alt="connector" />
        </div>
        <div class="checkbox-group">
            <label for="includePrevId">Include Previous ID:</label>
            <input
                id="includePrevId"
                type="checkbox"
                bind:checked={includePrevId}
            />
        </div>
        {#if includePrevId}
            <div class="input-group">
                <label for="prevId">Previous ID</label>
                <input id="prevId" type="number" bind:value={prevId} />
            </div>
        {/if}
        <div class="connector">
            <img src={connector} alt="connector" />
        </div>
        <div class="input-group">
            <label for="timestamp">Timestamp</label>
            <input
                id="timestamp"
                type="number"
                bind:value={timestamp}
                required
            />
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
            <label for="dataType">Data Type</label>
            <select id="dataType" bind:value={dataType}>
                <option value="Int">Int</option>
                <option value="Text">Text</option>
                <option value="Bool">Bool</option>
                <option value="Other">Other</option>
                <!-- Добавьте другие типы по необходимости -->
            </select>
        </div>
        <div class="input-group">
            <label for="dataValue">Data Value</label>
            <input type="text" id="dataValue" bind:value={dataValue} />
        </div>
        <div class="connector">
            <img src={connector} alt="connector" />
        </div>
        <div class="checkbox-group">
            <label for="includeHeaders">Include Headers:</label>
            <input
                id="includeHeaders"
                type="checkbox"
                bind:checked={includeHeaders}
            />
        </div>
        {#if includeHeaders}
            <div class="connector">
                <img src={connector} alt="connector" />
            </div>
            <div class="input-group">
                <label for="headers">Headers (JSON)</label>
                <textarea id="headers" bind:value={headers}></textarea>
            </div>
        {/if}
        <button on:click={handleSubmit}>Publish Event</button>
    </div>
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Krona+One&display=swap");

    .event-form {
        font-family: "Krona One", Arial, sans-serif;
        max-width: 300px;
        margin: 0 auto;
        padding: 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .input-group,
    .checkbox-group {
        position: relative;
        margin-bottom: 25px;
    }

    .checkbox-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    label {
        font-size: 0.8rem;
        color: #0f053a;
        margin-bottom: 5px;
        display: block;
    }

    input[type="text"],
    input[type="number"],
    textarea,
    select {
        width: 100%;
        padding: 10px;
        border: 2px solid #7e7b8e;
        border-radius: 10px;
        font-size: 14px;
        font-family: "Krona One", sans-serif;
        color: #7e7b8e;
        box-sizing: border-box;
    }

    input[type="checkbox"] {
        width: auto;
    }

    textarea {
        height: 100px;
        resize: vertical;
    }

    input:focus,
    textarea:focus {
        outline: none;
        border-color: #007bff;
    }

    button {
        width: 100%;
        font-family: "Krona One", sans-serif;
        padding: 10px;
        background-color: #fbfcfd;
        color: black;
        border: solid 2px #007bff;
        border-radius: 10px;
        font-size: 1rem;
        cursor: pointer;
        transition:
            background-color 0.3s,
            color 0.3s;
        margin-top: 20px;
    }

    button:hover {
        background-color: #0056b3;
        color: white;
    }

    .connector {
        display: flex;
        justify-content: center;
        margin: 10px 0;
    }
</style>
