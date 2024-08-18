<script>
    // @ts-nocheck

    import {
        loginII,
        logout,
        isAuthenticated,
        client_canister,
        client_canister_actor,
        CLIENT_CANISTER_ID,
    } from "../auth.js";
    import { Principal } from "@dfinity/principal";
    import "../index.scss";
    import ComplexDataInput from "../components/ComplexDataInput.svelte";
    // import PubTest from "../components/PubTest.svelte";

    let isPublishing = false;
    let publishResult = null;

    // let client_canister = 'mmt3g-qiaaa-aaaal-qi6ra-cai';
    let loggedIn = false;
    let prevId = null;
    let includePrevId = false;
    let includeHeaders = false;
    let id = 0;
    let namespace = "event.hub.balance";
    let timestamp = Date.now();
    let headers = [];
    let complexData = { type: "Text", value: "" };

    function handleLogin() {
        loginII();
    }

    function handleLogout() {
        logout();
    }

    isAuthenticated.subscribe((value) => {
        loggedIn = value;
    });

    function addHeader() {
        headers = [
            ...headers,
            { fieldName: "", fieldType: "Text", fieldValue: "" },
        ];
    }

    function removeHeader(index) {
        headers = headers.filter((_, i) => i !== index);
    }

    function updateHeader(index, field, value) {
        headers = headers.map((header, i) =>
            i === index ? { ...header, [field]: value } : header,
        );
    }

    function convertToICRC16(data) {
        switch (data.type) {
            case "Text":
                return { Text: data.value };
            case "Nat":
                return { Nat: parseInt(data.value) };
            case "Int":
                return { Int: parseInt(data.value) };
            case "Bool":
                return { Bool: data.value === "true" };
            case "Map":
                return {
                    Map: Object.entries(data.value).map(([key, val]) => [
                        key,
                        convertToICRC16(val),
                    ]),
                };
            case "Array":
                return {
                    Array: data.value.map((item) => convertToICRC16(item)),
                };
            default:
                return { Text: data.value };
        }
    }

    async function handleSubmit() {
        isPublishing = true;
        publishResult = null;

        const event = {
            id: Number(id),
            prevId: includePrevId ? [Number(prevId)] : [],
            timestamp: BigInt(timestamp),
            namespace: namespace,
            source: Principal.fromText(CLIENT_CANISTER_ID),
            data: convertToICRC16(complexData),
            headers: includeHeaders
                ? [
                      headers.map((h) => [
                          h.fieldName,
                          convertToICRC16({
                              type: h.fieldType,
                              value: h.fieldValue,
                          }),
                      ]),
                  ]
                : [],
        };
        try {
            let actor = client_canister_actor;
            if (!client_canister_actor) {
                console.log("Creating new client_canister actor");
                actor = await client_canister();
            }
            const result = await actor.publish(event);
            if ("ok" in result) {
                console.log("Event published successfully. IDs:", result.ok);
                publishResult = { success: true, id: result.ok };
            } else {
                console.error("Error publishing event:", result.err);
                publishResult = { success: false, error: result.err };
            }
        } catch (error) {
            console.error("Error calling publish method:", error);
            publishResult = { success: false, error: error.message };
        } finally {
            isPublishing = false;
        }
    }
</script>

<main style="margin-top: 4rem;">
    <!-- <PubTest /> -->
    {#if loggedIn}
        <div>
            <div class="event-form">
                <div class="input-group">
                    <label for="id">ID</label>
                    <input type="number" id="id" bind:value={id} />
                </div>
                <div class="checkbox-group">
                    <label for="includePrevId">Add Previous ID?</label>
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
                <div class="input-group">
                    <label for="timestamp">Timestamp</label>
                    <input
                        id="timestamp"
                        type="number"
                        bind:value={timestamp}
                        required
                    />
                </div>
                <div class="input-group">
                    <label for="namespace">Namespace</label>
                    <input type="text" id="namespace" bind:value={namespace} />
                </div>

                <div class="input-group">
                    <label for="dataType">Data Type</label>
                    <select id="dataType" bind:value={complexData.type}>
                        <option value="Text">Text</option>
                        <option value="Nat">Nat</option>
                        <option value="Int">Int</option>
                        <option value="Bool">Bool</option>
                        <option value="Map">Map</option>
                        <option value="Array">Array</option>
                    </select>
                </div>

                <ComplexDataInput bind:data={complexData} />

                <div class="checkbox-group">
                    <label for="includeHeaders">Add Headers?</label>
                    <input
                        id="includeHeaders"
                        type="checkbox"
                        bind:checked={includeHeaders}
                    />
                </div>
                {#if includeHeaders}
                    <button on:click={addHeader}>Add Header</button>
                    {#each headers as header, index}
                        <div class="input-group header-group">
                            <div class="field-group">
                                <label for={`fieldName${index}`}
                                    >Header Name</label
                                >
                                <input
                                    id={`fieldName${index}`}
                                    type="text"
                                    value={header.fieldName}
                                    on:input={(e) =>
                                        updateHeader(
                                            index,
                                            "fieldName",
                                            e.target.value,
                                        )}
                                />
                            </div>
                            <div class="field-group">
                                <label for={`fieldType${index}`}
                                    >Header Data Type</label
                                >
                                <select
                                    id={`fieldType${index}`}
                                    value={header.fieldType}
                                    on:change={(e) =>
                                        updateHeader(
                                            index,
                                            "fieldType",
                                            e.target.value,
                                        )}
                                >
                                    <option value="Text">Text</option>
                                    <option value="Nat">Nat</option>
                                    <option value="Int">Int</option>
                                    <option value="Bool">Bool</option>
                                </select>
                            </div>
                            <div class="field-group">
                                <label for={`fieldValue${index}`}
                                    >Header Value</label
                                >
                                <input
                                    id={`fieldValue${index}`}
                                    type="text"
                                    value={header.fieldValue}
                                    on:input={(e) =>
                                        updateHeader(
                                            index,
                                            "fieldValue",
                                            e.target.value,
                                        )}
                                />
                            </div>
                            <button on:click={() => removeHeader(index)}
                                >Remove</button
                            >
                        </div>
                    {/each}
                {/if}
                <button
                    on:click={handleSubmit}
                    class:publishing={isPublishing}
                    class:success={publishResult && publishResult.success}
                    class:error={publishResult && !publishResult.success}
                    disabled={isPublishing}
                >
                    {#if isPublishing}
                        <span class="spinner"></span>
                    {:else if publishResult && publishResult.success}
                        Ok! Id = {publishResult.id}
                    {:else if publishResult && !publishResult.success}
                        Error: {publishResult.error}
                    {:else}
                        Publish
                    {/if}
                </button>
            </div>
            <div class="button-container">
                <button class="logout" on:click={handleLogout}> Logout</button>
            </div>
        </div>
    {:else}
        <div class="button-container">
            <button class="login" on:click={handleLogin}>
                Login with Internet Identity</button
            >
        </div>
    {/if}
</main>

<style>
    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }

    .publishing {
        background-color: #f0f0f0;
        color: #333;
    }

    .success {
        background-color: #d4edda;
        color: #155724;
    }

    .error {
        background-color: #f8d7da;
        color: #721c24;
    }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #333;
        border-top: 2px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
