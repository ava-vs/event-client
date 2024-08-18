<script>
	// @ts-nocheck
	import {
		loginII,
		logout,
		isAuthenticated,
		client_canister_actor,
		client_canister,
		CLIENT_CANISTER_ID,
	} from "../auth.js";
	import { Principal } from "@dfinity/principal";
	import "../index.scss";

	let loggedIn = false;

	function handleLogin() {
		loginII();
	}

	function handleLogout() {
		logout();
	}
	isAuthenticated.subscribe((value) => {
		loggedIn = value;
	});
	// let subscriber = CLIENT_CANISTER_ID;

	let namespace = "test";
	// let filter = namespace;
	let subscriptionInfo = {
		namespace: namespace,
		subscriber: Principal.fromText(CLIENT_CANISTER_ID),
		active: true,
		filters: [namespace],
		messagesReceived: 0,
		messagesRequested: 0,
		messagesConfirmed: 0,
	};
	let isPublishing = false;
	let publishResult = null;

	async function handleSubmit() {
		isPublishing = true;
		publishResult = null;

		subscriptionInfo = {
			...subscriptionInfo,
			namespace: namespace,
			filters: [namespace],
		};

		console.log("Submitted:", { subscriptionInfo });
		let actor = client_canister_actor;
		if (!client_canister_actor) {
			console.log("Creating new client_canister actor");
			actor = await client_canister();
		}
		const subscription = await actor.subscribe(subscriptionInfo);
		console.log("Subscription created: ", subscription);
		isPublishing = false;
		publishResult = subscription;
		return subscription;
	}
</script>

<main style="margin-top: 4rem;">
	<div class="text-column">
		{#if loggedIn}
			<div>
				<div class="subscription-form">
					<!-- <div class="input-group">
						<label for="subscriber">Subscriber</label>
						<input type="text" id="subscriber" bind:value={subscriber} />
					</div> -->
					<div class="input-group">
						<label for="namespace">Namespace</label>
						<input
							type="text"
							id="namespace"
							bind:value={namespace}
						/>
					</div>
					<!-- <div class="input-group">
						<label for="filter">Filter</label>
						<input type="text" id="filter" bind:value={filter} />
					</div> -->
					<button
						on:click={handleSubmit}
						class:publishing={isPublishing}
						class:success={publishResult}
						class:error={publishResult && !publishResult === null}
						disabled={isPublishing}
					>
						{#if isPublishing}
							<span class="spinner"></span>
						{:else if publishResult}
							Ok!
						{:else if publishResult === false}
							Error!
						{:else}
							Submit
						{/if}
					</button>
				</div>
				<div class="button-container">
					<button class="logout" on:click={handleLogout}>
						Logout</button
					>
				</div>
			</div>
		{:else}
			<div class="button-container">
				<button class="login" on:click={handleLogin}>
					Login with Internet Identity</button
				>
			</div>
		{/if}
		<p />
	</div>
</main>

<!-- <script>
	import { _client_canister_actor } from './+page.js';
	import { loginII, logout, isAuthenticated } from '../auth.js';
	import { Principal } from '@dfinity/principal';
	import '../index.scss';

	let client_canister = 'mmt3g-qiaaa-aaaal-qi6ra-cai';

	let loggedIn = false;

	function handleLogin() {
		loginII();
	}

	function handleLogout() {
		logout();
	}
	isAuthenticated.subscribe((value) => {
		loggedIn = value;
	});
	let subscriber = 'mmt3g-qiaaa-aaaal-qi6ra-cai';
	let filter = 'Filter 1';
	let namespace = 'test';
	let subscriptionInfo = {
		namespace: namespace,
		subscriber: Principal.fromText(client_canister),
		active: true,
		filters: [namespace],
		messagesReceived: 0,
		messagesRequested: 0,
		messagesConfirmed: 0
	};

	async function handleSubmit() {
		console.log('Submitted:', { subscriber, namespace, filter });
		// @ts-ignore
		const subscription = await _client_canister_actor.subscribe(subscriptionInfo);
		console.log('Subscription created: ', subscription);
		return subscription;
	}
</script>

<main style="margin-top: 4rem;">
	<div class="text-column">
		{#if loggedIn}
			<div>
				<div class="subscription-form">
					<div class="input-group">
						<label for="subscriber">Subscriber</label>
						<input type="text" id="subscriber" bind:value={subscriber} />
					</div>
					<div class="input-group">
						<label for="namespace">Namespace</label>
						<input type="text" id="namespace" bind:value={namespace} />
					</div>
					<div class="input-group">
						<label for="filter">Filter</label>
						<input type="text" id="filter" bind:value={filter} />
					</div>
					<button on:click={handleSubmit}>Submit</button>
				</div>
				<button class="logout" on:click={handleLogout}> Logout</button>
			</div>
		{:else}
			<button class="login" on:click={handleLogin}> Login with Internet Identity</button>
		{/if}
		<p />
	</div>
</main> -->

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
