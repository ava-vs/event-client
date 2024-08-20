<script>
	import { createEventDispatcher } from 'svelte';

	export let reaction;
	export let disabled = false;

	let formData = {};
	const dispatch = createEventDispatcher();

	$: fields = getFields(reaction.template);

	function getFields(template) {
		console.log('Template received:', template);
		if (typeof template === 'object' && template !== null) {
			if (template instanceof Map) {
				const fieldsArray = template.get('fields');
				if (Array.isArray(fieldsArray)) {
					return fieldsArray.map((field) => ({
						name: field.get('name'),
						fieldType: field.get('fieldType'),
						required: field.get('required')
					}));
				}
			} else if (template.Map) {
				const fieldsMap = new Map(template.Map);
				if (fieldsMap.has('fields') && Array.isArray(fieldsMap.get('fields'))) {
					return fieldsMap.get('fields').map((field) => {
						const fieldMap = new Map(field.Map);
						return {
							name: fieldMap.get('name'),
							fieldType: fieldMap.get('fieldType'),
							required: fieldMap.get('required')
						};
					});
				}
			}
		}
		console.log('Parsed fields:', fields);
		return [];
	}

	function handleSubmit() {
		if (!disabled) {
			dispatch('reaction', {
				...reaction,
				data: formData
			});
			formData = {};
		}
	}
</script>

<div class="registration-form-reaction">
	<form on:submit|preventDefault={handleSubmit}>
		{#each fields as field}
			<div class="form-field">
				<label for={field.name}>{field.name}</label>
				{#if field.fieldType === 'Text'}
					<input
						type="text"
						id={field.name}
						bind:value={formData[field.name]}
						required={field.required}
						{disabled}
					/>
				{:else if field.fieldType === 'Number'}
					<input
						type="number"
						id={field.name}
						bind:value={formData[field.name]}
						required={field.required}
						{disabled}
					/>
				{:else if field.fieldType === 'Boolean'}
					<input type="checkbox" id={field.name} bind:checked={formData[field.name]} {disabled} />
				{/if}
			</div>
		{/each}
		<button type="submit" {disabled}>Submit</button>
	</form>
</div>

<style>
	.registration-form-reaction {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.form-field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	input {
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
