<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { isAuthenticated, principalId, dao_backend, dao_canister_actor } from '../auth.js';
	import { Principal } from '@dfinity/principal';
	import '../index.scss';

	//-------------------------- tabs
	import Tabs from '../components/Tab.svelte';
	import PForm from '../components/ProposalForm.svelte';

	let tabItems = ['Proposals', 'Profile'];
	let activeItem = 'Proposals';

	const triggerTabChange = (/** @type {{ detail: string; }} */ event) => {
		activeItem = event.detail;
	};

	//--------------------------------------------------------------------

	const CANISTER_PRINCIPAL = 'mmt3g-qiaaa-aaaal-qi6ra-cai'; // TODO replace with process.env.CANISTER_ID_CLIENT

	let principal = '';
	let loggedIn = false;
	let activeTab = 'Proposals';

	// @ts-ignore
	/**
	 * @type {string | any[]}
	 */
	let proposals = [];
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
			console.error('Error fetching proposals:', error);
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
		if (statusLog.length === 0) return 'Open';
		const lastStatus = statusLog[statusLog.length - 1];
		if ('executed' in lastStatus) return 'Executed';
		if ('rejected' in lastStatus) return 'Rejected';
		if ('failedToExecute' in lastStatus) return 'Failed to Execute';
		if ('executing' in lastStatus) return 'Executing';
		return 'Unknown';
	}

	// @ts-ignore
	function serializeBigInt(key, value) {
		if (typeof value === 'bigint') {
			return value.toString();
		}
		return value;
	}

	// @ts-ignore
	function renderProposalContent(content) {
		if (typeof content === 'object' && content !== null) {
			if (content.hasOwnProperty('codeUpdate')) {
				return `Code Update: ${content.codeUpdate.description}`;
			} else if (content.hasOwnProperty('transferFunds')) {
				const transfer = content.transferFunds;
				return `Transfer Funds: Amount ${transfer.amount} to ${transfer.recipient} for ${
					Object.keys(transfer.purpose)[0]
				}`;
			} else if (content.hasOwnProperty('adjustParameters')) {
				const adjust = content.adjustParameters;
				return `Adjust Parameters: ${adjust.parameterName} to ${adjust.newValue}. ${adjust.description}`;
			} else if (content.hasOwnProperty('other')) {
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
		let actor = client_canister_actor;
		try {
			if (!client_canister_actor) {
				actor = await dao_backend();
			}
			const result = await actor.getMember(Principal.fromText(CANISTER_PRINCIPAL));
			balance = result[0].votingPower;
			console.log('Balance: ', result);
		} catch (error) {
			console.error('Error fetching balance:', error);
		} finally {
			isLoading = false;
		}
	}

	// Reactive statement to call getBalance when activeItem changes to 'Profile'
	$: if (activeItem === 'Profile') {
		getBalance();
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
	{#if activeItem === 'Proposals'}
		{#if proposals.length > 0}
			<div class="proposals-container">
				<p class="proposal-count">Attention DAO Proposals: {proposals.length}</p>
				<button class="dao-button" on:click={fetchProposals} disabled={isLoading}>
					{isLoading ? 'Loading...' : 'Refresh Proposals'}
				</button>
				<div class="card-list">
					{#each proposals as proposal}
						<div class="card">
							<h2 class="card-title">Proposal ID: {proposal.id}</h2>
							<p><strong>Proposer:</strong> {proposal.proposerId.toText()}</p>
							<p><strong>Start Time:</strong> {formatDate(proposal.timeStart)}</p>
							<p><strong>End Time:</strong> {formatDate(proposal.timeEnd)}</p>
							<p><strong>Status:</strong> {getProposalStatus(proposal.statusLog)}</p>
							<details>
								<summary>More details</summary>
								<div class="proposal-content">
									<h4>Proposal Content:</h4>
									<pre>{renderProposalContent(proposal.content)}</pre>
								</div>
								<div class="voting-summary">
									<h4>Voting Summary:</h4>
									<p>Total Votes: {proposal.votes.length}</p>
									<p>
										Yes Votes: {proposal.votes.filter(
											(/** @type {{ value: boolean[]; }[]} */ v) => v[1].value[0] === true
										).length}
									</p>
									<p>
										No Votes: {proposal.votes.filter(
											(/** @type {{ value: boolean[]; }[]} */ v) => v[1].value[0] === false
										).length}
									</p>
								</div>
							</details>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p>No proposals available</p>
		{/if}
	{:else if activeItem === 'Profile'}
		<div class="proposals-container">
			{#if balance !== null}
				<span>Balance = {balance}</span>
				<br />

				<PForm />
			{:else}
				<span>Loading balance...</span>
			{/if}
		</div>
	{:else}
		<p>404</p>
	{/if}
	<!------------------------ tabs -->

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
</style>
