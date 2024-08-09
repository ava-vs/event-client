<!-- CustomCard.svelte -->
<script>
	export let className = '';
</script>

<div class="card {className}">
	<slot></slot>
</div>

<style>
	.card {
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 16px;
		margin-bottom: 16px;
	}
</style>
