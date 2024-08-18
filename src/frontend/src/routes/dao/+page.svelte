<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import {
        isAuthenticated,
        principalId,
        dao_backend,
        dao_canister_actor,
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

    onMount(() => {
        fetchProposals();
    });

    /**
     * @type {any}
     */
    let balance = null;

    async function getBalance() {
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
        isLoading = true;
        let actor = dao_canister_actor;
        try {
            if (!dao_canister_actor) {
                actor = await dao_backend();
            }
            console.log(
                "Voting request: ",
                proposalId,
                CLIENT_CANISTER_ID,
                voteYes,
            );
            const result = await actor.vote(
                proposalId,
                CLIENT_CANISTER_ID,
                voteYes,
            );
            console.log("Vote result:", result);
            // Optionally, you can refresh the proposals after voting
            await fetchProposals();
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            isLoading = false;
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
                                <div class="voting-buttons">
                                    <button
                                        class="vote-button yes"
                                        on:click={() => vote(proposal.id, true)}
                                    >
                                        Vote Yes
                                    </button>
                                    <button
                                        class="vote-button no"
                                        on:click={() =>
                                            vote(proposal.id, false)}
                                    >
                                        Vote No
                                    </button>
                                </div>
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
            {#if balance !== null}
                <span>Balance = {balance} $FOCUS</span>
                <br />
                <div class="proposal-form">
                    <PForm />
                </div>
                <br />
                <!-- <div style="position:relative;padding-bottom:56.25%;">
					<iframe
						style="width:100%;height:100%;position:absolute;left:0px;top:0px"
						src="https://embed.app.guidde.com/playbooks/m9p1arqmGcsTpg5bJJzMog"
						title="Attention DAO & Event Hub"
						frameborder="0"
						referrerpolicy="unsafe-url"
						allowfullscreen="true"
						allow="clipboard-write"
						sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-forms allow-same-origin allow-presentation"
					></iframe>
				</div>
				<p style="display: none">
					00:00: In the attention down an event Hub section. 00:02: We will walk you through the
					necessary steps to navigate the attention Dao 00:06: application. From accessing proposals
					to submitting votes. 00:10: This guide will ensure that you are equipped with the
					knowledge to work efficiently within 00:14: the platform. 00:17: Access the proposal
					section. It's a heart of Dao governance. 00:22: Use the refresh proposals button to update
					the list of proposals. 00:27: To check your balance and navigate to your profile settings.
					00:30: Click the profile tab. 00:33: Here you will find the new proposal form. You can
					access the proposal 00:37: types and choose from other code update parameter adjustment
					00:41: and transfer funds. Select the other type for now. 00:47: Select the action you
					want to perform? For other it is a text 00:51: box. 00:53: Open the description field.
					It's a good practice to provide a brief 00:57: but informative overview of your proposal.
					01:01: Enter testing for testing purposes. 01:04: The input just testing for testing
					purposes 01:08: Submit the proposal It will take a few seconds to validate and 01:12:
					Save. 01:14: Return to the proposal section 01:17: Update the proposals list 01:20: Vote
					negatively on a proposal 01:23: Update the proposals list 01:26: This guide focuses on the
					core features of attention Dao. 01:30: Managing a Dao starts with creating a new proposal
					and pitching your voice. 01:35: The rest of the platforms features such as subscribing to
					events publishing 01:39: events and receiving and responding to subscription notifications
					are 01:44: covered in the following videos.
				</p> -->
            {:else if isLoading}
                <span>Loading balance...</span>
            {:else}
                <span>No balance found</span>
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

    .vote-button:disabled {
        opacity: 0.5;
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
