<script>
	import copy_icon from "$lib/images/copy_icon.png";
	import { loginII, logout, isAuthenticated, principalId } from "./auth.js";

	let loggedIn = false;
	let principal = "";
	principalId.subscribe((value) => {
		principal = value;
	});

	function handleLogin() {
		loginII();
	}

	function handleLogout() {
		logout();
	}

	isAuthenticated.subscribe((value) => {
		loggedIn = value;
	});

	async function copyValue() {
		await navigator.clipboard.writeText(principal);
		alert("ID скопирован: " + principal);
	}
</script>

<svelte:head>
	<title>aVa Check Home</title>
	<meta name="description" content="aVa Reputation Demo app" />
</svelte:head>

<section>
	<h1>
		<!-- <span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome} alt="Welcome" />
			</picture>
		</span> -->
		<br />
	</h1>
	{#if loggedIn}
		<h2>Your aVa id is:</h2>
		<span class="user_principal"
			>{principal}
			<button on:click={copyValue}
				><img class="copy_icon" src={copy_icon} alt="Copy ID" /></button
			>
		</span>
		<br />
		<h2>
			Save your this id and Internet Identity number for later use. <br />
		</h2>
		<br />
		<button class="logout" on:click={handleLogout}> Logout</button>
	{:else}
		<button class="login" on:click={handleLogin}>
			Please Login with Internet Identity</button
		>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: inherit;
	}

	h2 {
		max-width: 450px;
		margin: 0 auto;
		text-align: center;
		margin-top: 1em;
		margin-bottom: 1em;
		font-size: 1.2em;
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

	.copy_icon {
		width: 15px;
		height: 20px;
	}
</style>
