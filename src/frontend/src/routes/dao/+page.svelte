<script lang="ts">
    // @ts-nocheck

    import { onMount } from "svelte";
    import {
        loginII,
        logout,
        isAuthenticated,
        principalId,
        dao_backend,
        dao_canister_actor,
        client_canister,
        CLIENT_CANISTER_ID,
    } from "../auth.js";

    import { Principal } from "@dfinity/principal";
    import "../index.scss";

    //-------------------------- tabs
    import Tabs from "../components/Tab.svelte";
    import PForm from "../components/ProposalForm.svelte";

    let tabItems = ["Proposals", "Profile"];
    let activeItem = "Proposals";

    const triggerTabChange = (/** @type {{ detail: string; }} */ event) => {
        activeItem = event.detail;
    };

    //--------------------------------------------------------------------

    let principal = "";
    let loggedIn = false;
    let activeTab = "Proposals";

    let votingProposalId = null;
    let votingResult = {};

    function handleLogin() {
        loginII();
    }

    function handleLogout() {
        logout();
    }

    // @ts-ignore
    /**
     * @type {string | any[]}
     */
    let proposals = [];

    $: sortedProposals = [...proposals].reverse();

    let isLoading = false;

    /**
     * @param {{ detail: string; }} event
     */
    function handleTabChange(event) {
        activeTab = event.detail;
    }

    principalId.subscribe((value) => {
        principal = value;
    });

    isAuthenticated.subscribe((value) => {
        loggedIn = value;
    });

    // Reactive statement to call getBalance when activeItem changes to 'Profile' and user is logged in
    $: if (activeItem === "Profile" && loggedIn) {
        getBalance();
    }

    async function fetchProposals() {
        isLoading = true;
        let actor = dao_canister_actor;
        try {
            if (!dao_canister_actor) {
                // @ts-ignore
                actor = await dao_backend();
            }
            // @ts-ignore
            const result = await actor.getProposals(100, 0); // Fetch up to 100 proposals, starting from offset 0
            proposals = result.data;
            console.log("Proposals: ", proposals);
        } catch (error) {
            console.error("Error fetching proposals:", error);
        } finally {
            isLoading = false;
        }
    }

    // @ts-ignore
    function formatDate(timestamp) {
        return new Date(Number(timestamp) / 1000000).toLocaleString();
    }

    // @ts-ignore
    function getProposalStatus(statusLog) {
        if (statusLog.length === 0) return "Open";
        const lastStatus = statusLog[statusLog.length - 1];
        if ("executed" in lastStatus) return "Executed";
        if ("rejected" in lastStatus) return "Rejected";
        if ("failedToExecute" in lastStatus) return "Failed to Execute";
        if ("executing" in lastStatus) return "Executing";
        return "Unknown";
    }

    // @ts-ignore
    function serializeBigInt(key, value) {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    }

    // @ts-ignore
    function renderProposalContent(content) {
        if (typeof content === "object" && content !== null) {
            if (content.hasOwnProperty("codeUpdate")) {
                return `Code Update: ${content.codeUpdate.description}`;
            } else if (content.hasOwnProperty("transferFunds")) {
                const transfer = content.transferFunds;
                return `Transfer Funds: Amount ${transfer.amount} to ${transfer.recipient} for ${
                    Object.keys(transfer.purpose)[0]
                }`;
            } else if (content.hasOwnProperty("adjustParameters")) {
                const adjust = content.adjustParameters;
                return `Adjust Parameters: ${adjust.parameterName} to ${adjust.newValue}. ${adjust.description}`;
            } else if (content.hasOwnProperty("other")) {
                return `Other: ${content.other.description} - Action: ${content.other.action}`;
            }
        }
        return JSON.stringify(content, serializeBigInt, 2);
    }

    let clientActor: any;

    onMount(async () => {
        clientActor = await client_canister();
    });

    onMount(() => {
        fetchProposals();
    });

    let balance = null;

    async function getBalance() {
        if (!loggedIn) {
            balance = null;
            return;
        }
        isLoading = true;
        let actor = dao_canister_actor;
        try {
            if (!dao_canister_actor) {
                actor = await dao_backend();
            }
            const result = await actor.getMember(
                Principal.fromText(CLIENT_CANISTER_ID),
            );

            console.log("Balance: ", result);

            balance = result.length > 0 ? result[0].votingPower : 0;
        } catch (error) {
            console.error("Error fetching balance:", error);
        } finally {
            isLoading = false;
        }
    }

    // Reactive statement to call getBalance when activeItem changes to 'Profile'
    $: if (activeItem === "Profile") {
        getBalance();
    }

    async function vote(proposalId, voteYes) {
        votingProposalId = proposalId;
        votingResult[proposalId] = {
            isLoading: true,
            success: null,
            error: null,
        };
        isLoading = true;
        // let actor = dao_canister_actor;
        try {
            const result = await clientActor.vote(
                proposalId,
                CLIENT_CANISTER_ID,
                voteYes,
            );
            console.log("Vote result:", result);
            votingResult[proposalId] = {
                isLoading: false,
                success: true,
                error: null,
            };
            // Optionally, you can refresh the proposals after voting
            await fetchProposals();
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            isLoading = false;

            setTimeout(() => {
                votingResult[proposalId] = {
                    isLoading: false,
                    success: null,
                    error: null,
                };
                votingProposalId = null;
            }, 3000);
        }
    }
</script>

<svelte:head>
    <title>Attention DAO - Proposals</title>
    <meta name="description" content="Attention DAO Proposals" />
</svelte:head>

<main>
    <br />
    <!------------------------ tabs -->
    <Tabs {tabItems} {activeItem} on:tabChange={triggerTabChange} />
    {#if activeItem === "Proposals"}
        {#if proposals.length > 0}
            <div class="proposals-container">
                <p class="proposal-count">
                    Attention DAO Proposals: {proposals.length}
                </p>
                <button
                    class="dao-button"
                    on:click={fetchProposals}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Refresh Proposals"}
                </button>
                <div class="card-list">
                    {#each sortedProposals as proposal}
                        <div class="card">
                            <h2 class="card-title">
                                Proposal ID: {proposal.id}
                            </h2>
                            <p>
                                <strong>Proposer:</strong>
                                {proposal.proposerId.toText()}
                            </p>
                            <p>
                                <strong>Start Time:</strong>
                                {formatDate(proposal.timeStart)}
                            </p>
                            <p>
                                <strong>End Time:</strong>
                                {formatDate(proposal.timeEnd)}
                            </p>
                            <p>
                                <strong>Status:</strong>
                                {getProposalStatus(proposal.statusLog)}
                            </p>

                            {#if getProposalStatus(proposal.statusLog) === "Open"}
                                {#if loggedIn}
                                    <div class="voting-buttons">
                                        <button
                                            class="vote-button yes"
                                            on:click={() =>
                                                vote(proposal.id, true)}
                                            disabled={votingProposalId ===
                                                proposal.id}
                                        >
                                            {#if votingResult[proposal.id]?.isLoading}
                                                <span class="spinner"></span>
                                            {:else if votingResult[proposal.id]?.success}
                                                Voted!
                                            {:else if votingResult[proposal.id]?.error}
                                                Error
                                            {:else}
                                                Vote Yes
                                            {/if}
                                        </button>
                                        <button
                                            class="vote-button no"
                                            on:click={() =>
                                                vote(proposal.id, false)}
                                            disabled={votingProposalId ===
                                                proposal.id}
                                        >
                                            {#if votingResult[proposal.id]?.isLoading}
                                                <span class="spinner"></span>
                                            {:else if votingResult[proposal.id]?.success}
                                                Voted!
                                            {:else if votingResult[proposal.id]?.error}
                                                Error
                                            {:else}
                                                Vote No
                                            {/if}
                                        </button>
                                    </div>
                                {:else}
                                    <div class="button-container">
                                        <button
                                            class="login"
                                            on:click={handleLogin}
                                        >
                                            Login to Vote
                                        </button>
                                    </div>
                                {/if}
                            {/if}

                            <details>
                                <summary>More details</summary>
                                <div class="proposal-content">
                                    <h4>Proposal Content:</h4>
                                    <pre>{renderProposalContent(
                                            proposal.content,
                                        )}</pre>
                                </div>
                                <div class="voting-summary">
                                    <h4>Voting Summary:</h4>
                                    <p>Total Votes: {proposal.votes.length}</p>
                                    <p>
                                        Yes Votes: {proposal.votes.filter(
                                            (v) => v[1].value[0] === true,
                                        ).length}
                                    </p>
                                    <p>
                                        No Votes: {proposal.votes.filter(
                                            (v) => v[1].value[0] === false,
                                        ).length}
                                    </p>
                                </div>
                            </details>
                        </div>
                    {/each}
                </div>
            </div>
        {:else if isLoading}
            <p>Loading proposals...</p>
        {:else}
            <p>No proposals available</p>
        {/if}
    {:else if activeItem === "Profile"}
        <div class="proposals-container">
            {#if loggedIn}
                {#if balance !== null}
                    <span>Balance = {balance} $FOCUS</span>
                    <br />
                    <PForm />
                    <br />
                    <div class="button-container">
                        <button class="logout" on:click={handleLogout}>
                            Logout</button
                        >
                    </div>
                {:else if isLoading}
                    <span>Loading balance...</span>
                {:else}
                    <span>No balance found</span>
                {/if}
            {:else}
                <div class="button-container">
                    <button class="login" on:click={handleLogin}>
                        Login with Internet Identity</button
                    >
                </div>
            {/if}
        </div>
    {:else}
        <p>404</p>
    {/if}
    <br />
</main>

<style>
    .proposals-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .proposal-count {
        text-align: center;
        color: #7f8c8d;
        margin-bottom: 20px;
    }

    .card-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
        transition: transform 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px);
    }

    .card-title {
        color: #2c3e50;
        font-size: 1.2em;
        margin-bottom: 10px;
    }

    details {
        margin-top: 10px;
    }

    summary {
        cursor: pointer;
        color: var(--color-theme-2);
    }

    .proposal-content,
    .voting-summary {
        background-color: #f8f9fa;
        border-radius: 4px;
        padding: 10px;
        margin-top: 10px;
    }

    pre {
        white-space: pre-wrap;
        word-break: break-word;
    }

    .dao-button {
        background-color: var(--color-theme-2);
        border: none;
        color: white;
        padding: 10px 20px;
        /* text-align: center; */
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
        max-width: 40%;
    }

    .voting-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    .vote-button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        border-top: 2px solid transparent;
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

    .vote-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .vote-button.yes {
        background-color: #4caf50;
        color: white;
    }

    .vote-button.yes:hover:not(:disabled) {
        background-color: #45a049;
    }

    .vote-button.no {
        background-color: #f44336;
        color: white;
    }

    .vote-button.no:hover:not(:disabled) {
        background-color: #da190b;
    }
</style>
