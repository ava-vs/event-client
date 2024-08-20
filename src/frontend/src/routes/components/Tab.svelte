<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let tabItems;
	export let activeItem;
    export let active = false;
</script>

<div class="tabs">
	<ul role="tablist">
		{#each tabItems as item}
			<li role="tab"
            tabindex="0"
            aria-selected={active}
            class:active 
            on:click={() => dispatch('tabChange', item)}
            on:keydown={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault();
                  event.target.click();
                }
              }}>
				<div class:active={item === activeItem}>{item}</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.tabs {
		margin-bottom: 40px;
	}
	ul {
		display: flex;
		justify-content: center;
		padding: 0;
		list-style-type: none;
	}
	li {
		margin: 0 16px;
		font-size: 18px;
		color: #555;
		cursor: pointer;
	}
	.active {
		color: var(--color-theme-1);
		border-bottom: 2px solid var(--color-theme-2);
		padding-bottom: 8px;
	}
</style>
