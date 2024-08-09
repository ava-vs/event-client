<script>
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
</main>
