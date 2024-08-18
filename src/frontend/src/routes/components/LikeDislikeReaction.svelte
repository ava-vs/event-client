<script>
	import { createEventDispatcher } from 'svelte';

	export let reaction;
	export let disabled = false;

	const dispatch = createEventDispatcher();

	function handleChoice(choice) {
		if (!disabled) {
			dispatch('reaction', {
				...reaction,
				data: { choice }
			});
		}
	}
</script>

<div class="like-dislike-reaction">
	<button on:click={() => handleChoice('like')} {disabled}>👍 Like</button>
	<button on:click={() => handleChoice('dislike')} {disabled}>👎 Dislike</button>
</div>

<style>
	.like-dislike-reaction {
		display: flex;
		gap: 10px;
	}
	button {
		padding: 5px 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f0f0f0;
		cursor: pointer;
	}
	button:hover {
		background-color: #e0e0e0;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
