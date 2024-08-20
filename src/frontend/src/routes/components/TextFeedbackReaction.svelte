<script>
	import { createEventDispatcher } from 'svelte';

	export let reaction;
	export let disabled = false;

	let feedback = '';
	const dispatch = createEventDispatcher();

	function handleSubmit() {
		if (!disabled && feedback.trim()) {
			dispatch('reaction', {
				...reaction,
				data: { feedback }
			});
			feedback = '';
		}
	}
</script>

<div class="text-feedback-reaction">
	<textarea bind:value={feedback} placeholder="Enter your feedback" {disabled}></textarea>
	<button on:click={handleSubmit} {disabled}>Submit Feedback</button>
</div>

<style>
	.text-feedback-reaction {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	textarea {
		width: 100%;
		height: 100px;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 5px;
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
