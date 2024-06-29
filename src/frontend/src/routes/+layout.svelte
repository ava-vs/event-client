<script>
	import { browser } from "$app/environment";
	import { page } from "$app/stores";

	/** @type {import('./$types').LayoutServerData} */
</script>

<div class="app">
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Lexend+Zetta:wght@100..900&display=swap"
		rel="stylesheet"
	/>
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100vw; /* Full viewport width */
		overflow-x: hidden; /* Prevent horizontal scrolling */
	}
	main {
		flex: 1;
		padding-top: 3em;
		display: flex;
		flex-direction: column;
		padding: 0; /* Remove padding */
		width: 100%;
		min-width: 440px;
		height: 100%; /* Full height */
		margin: 0;
		box-sizing: border-box;
		overflow-y: auto; /* Allow vertical scrolling if needed */
	}
	@media (max-width: 480px) {
		main {
			width: 100vw; /* Full viewport width on mobile */
			min-height: 100vh; /* Minimum full viewport height */
		}
	}
</style>
