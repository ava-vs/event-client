<script>
	import { createEventDispatcher } from 'svelte';

	export let reactions = [];
	const dispatch = createEventDispatcher();

	function handleReaction(reaction) {
		dispatch('reaction', reaction);
	}

	function parseReactionTemplate(template) {
		if (typeof template === 'string') {
			return template;
		} else if (template instanceof Map) {
			return parseMapTemplate(template);
		} else if (typeof template === 'object' && template !== null) {
			return parseObjectTemplate(template);
		}
		return 'Unknown Template';
	}

	function parseMapTemplate(map) {
		if (map.has('type')) {
			return map.get('type');
		} else if (map.has('Text')) {
			return map.get('Text');
		}
		for (let [key, value] of map.entries()) {
			if (typeof value === 'string') {
				return value;
			} else if (typeof value === 'object') {
				let result = parseObjectTemplate(value);
				if (result !== 'Unknown Template') {
					return result;
				}
			}
		}
		return 'Unknown Template';
	}

	function parseObjectTemplate(obj) {
		if (obj.type) {
			return obj.type;
		} else if (obj.Text) {
			return obj.Text;
		}
		for (let key in obj) {
			if (typeof obj[key] === 'string') {
				return obj[key];
			} else if (typeof obj[key] === 'object') {
				let result = parseObjectTemplate(obj[key]);
				if (result !== 'Unknown Template') {
					return result;
				}
			}
		}
		return 'Unknown Template';
	}
</script>

<div class="reactions">
	{#each reactions as reaction}
		<button class="reaction-button" on:click={() => handleReaction(reaction)}>
			<span class="template">{parseReactionTemplate(reaction.template)}</span>
			<span class="price">{reaction.price} FOCUS</span>
		</button>
	{/each}
</div>

<style>
	.reactions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 10px;
	}
	.reaction-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f0f0f0;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	.reaction-button:hover {
		background-color: #e0e0e0;
	}
	.template {
		font-weight: bold;
	}
	.price {
		font-size: 0.8em;
		color: #666;
	}
</style>
