<!-- CustomButton.svelte -->
<script>
	export let onClick = () => {};
</script>

<button on:click={onClick}>
	<slot></slot>
</button>

<style>
	button {
		background-color: #1976d2;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover {
		background-color: #1565c0;
	}
</style>
