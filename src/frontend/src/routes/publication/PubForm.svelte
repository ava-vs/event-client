<script>
    import connector from "$lib/images/Connector.svg";
    import { _client_canister_actor } from "./+page.js";
    import { loginII, logout, isAuthenticated, principalId } from "../auth.js";
    import { Principal } from "@dfinity/principal";
    import "../../index.scss";

    let client_canister = "mmt3g-qiaaa-aaaal-qi6ra-cai";
    let loggedIn = false;
    let prevId = null;
    let headers = "";
    let includePrevId = false;
    let includeHeaders = false;
    let id = 0;
    let namespace = "event.hub.balance";
    let timestamp = Date.now();
    let dataType = "Text";
    let dataValue = "";
    let fieldName = "";
    let fieldType = "Text";
    let fieldValue = "";

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
            dataType: dataType,
            dataValue: dataValue,
            headers: [
                {
                    fieldName: fieldName,
                    fieldType: fieldType,
                    fieldValue: fieldValue,
                },
            ],
        };
        return _client_canister_actor
            .frontEvent_publish([event])
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
                <!-- Add more options as needed -->
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
                <!-- <label for="headers">Headers (JSON)</label>
                <textarea id="headers" bind:value={headers}></textarea> -->
                <label for="fieldName">Header Name</label>
                <input id="fieldName" type="text" bind:value={fieldName} />
                <label for="fieldType">Header Data Type</label>
                <select id="fieldType" bind:value={fieldType}>
                    <option value="Int">Int</option>
                    <option value="Text">Text</option>
                    <option value="Bool">Bool</option>
                    <option value="Text">Text</option>
                    <option value="Other">Other</option>
                </select>
                <label for="fieldValue">Header Value</label>
                <input id="fieldValue" type="text" bind:value={fieldValue} />
            </div>
        {/if}
        <button on:click={handleSubmit}>Publish</button>
    </div>
</main>
