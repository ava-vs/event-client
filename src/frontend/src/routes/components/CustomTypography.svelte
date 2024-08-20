<script>
	export let variant = 'body1';
	let className = '';
	export { className as class };
</script>

{#if variant === 'h4'}
	<h4 class={className}><slot></slot></h4>
{:else if variant === 'h6'}
	<h6 class={className}><slot></slot></h6>
{:else if variant === 'body2'}
	<p class="body2 {className}"><slot></slot></p>
{:else}
	<p class={className}><slot></slot></p>
{/if}

<style>
	h4 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	h6 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}
	.body2 {
		font-size: 0.875rem;
	}
</style>
