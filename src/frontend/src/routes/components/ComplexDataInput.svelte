<script>
	import { createEventDispatcher } from 'svelte';

	export let data;
	export let level = 0; // New prop to track nesting level

	const dispatch = createEventDispatcher();

	function updateData(newData) {
		data = newData;
		dispatch('update', newData);
	}

	function addMapEntry() {
		updateData({
			...data,
			value: { ...data.value, '': { type: 'Text', value: '' } }
		});
	}

	function removeMapEntry(key) {
		const newValue = { ...data.value };
		delete newValue[key];
		updateData({ ...data, value: newValue });
	}

	function updateMapEntry(key, newKey, newValue) {
		const newData = { ...data.value };
		delete newData[key];
		newData[newKey] = newValue;
		updateData({ ...data, value: newData });
	}

	function addArrayItem() {
		updateData({
			...data,
			value: [...data.value, { type: 'Text', value: '' }]
		});
	}

	function removeArrayItem(index) {
		updateData({
			...data,
			value: data.value.filter((_, i) => i !== index)
		});
	}

	function updateArrayItem(index, newValue) {
		updateData({
			...data,
			value: data.value.map((item, i) => (i === index ? newValue : item))
		});
	}

	$: if (data.type !== 'Map' && data.type !== 'Array') {
		updateData({ ...data, value: '' });
	} else if (data.type === 'Map' && !isObject(data.value)) {
		updateData({ ...data, value: {} });
	} else if (data.type === 'Array' && !Array.isArray(data.value)) {
		updateData({ ...data, value: [] });
	}

	function isObject(val) {
		return typeof val === 'object' && val !== null && !Array.isArray(val);
	}
</script>

<div class="complex-data-input" style="margin-left: {level * 20}px">
	{#if data.type === 'Map'}
		<div class="map-entries">
			<button on:click={addMapEntry}>Add Map Entry</button>
			{#each Object.entries(data.value) as [key, value]}
				<div class="map-entry">
					<input
						type="text"
						placeholder="Key"
						value={key}
						on:input={(e) => updateMapEntry(key, e.target.value, value)}
					/>
					<select bind:value={value.type}>
						<option value="Text">Text</option>
						<option value="Nat">Nat</option>
						<option value="Int">Int</option>
						<option value="Bool">Bool</option>
						<option value="Map">Map</option>
						<option value="Array">Array</option>
					</select>
					{#if value.type === 'Map' || value.type === 'Array'}
						<svelte:self
							bind:data={value}
							level={level + 1}
							on:update={(e) => updateMapEntry(key, key, e.detail)}
						/>
					{:else}
						<input
							type="text"
							placeholder="Value"
							bind:value={value.value}
							on:input={() => updateMapEntry(key, key, value)}
						/>
					{/if}
					<button on:click={() => removeMapEntry(key)} class="icon-button">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm0 5h2v9H9V8zm4 0h2v9h-2V8z"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{:else if data.type === 'Array'}
		<div class="array-items">
			<button on:click={addArrayItem}>Add Array Item</button>
			{#each data.value as item, index}
				<div class="array-item">
					<select bind:value={item.type}>
						<option value="Text">Text</option>
						<option value="Nat">Nat</option>
						<option value="Int">Int</option>
						<option value="Bool">Bool</option>
						<option value="Map">Map</option>
						<option value="Array">Array</option>
					</select>
					{#if item.type === 'Map' || item.type === 'Array'}
						<svelte:self
							bind:data={item}
							level={level + 1}
							on:update={(e) => updateArrayItem(index, e.detail)}
						/>
					{:else}
						<input
							type="text"
							placeholder="Value"
							bind:value={item.value}
							on:input={() => updateArrayItem(index, item)}
						/>
					{/if}
					<button on:click={() => removeArrayItem(index)} class="icon-button">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm0 5h2v9H9V8zm4 0h2v9h-2V8z"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<input type="text" bind:value={data.value} />
	{/if}
</div>

<style>
	.complex-data-input {
		margin-bottom: 1rem;
	}
	.map-entries,
	.array-items {
		margin-top: 0.5rem;
	}
	.map-entry,
	.array-item {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		align-items: center;
	}
	.map-entry input,
	.map-entry select,
	.array-item input,
	.array-item select {
		flex: 1;
		min-width: 150px;
		padding: 0.25rem;
	}
	button {
		padding: 0.25rem 0.5rem;
		font-size: 1rem;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		white-space: nowrap;
	}
	button:hover {
		background-color: #e0e0e0;
	}
	button.icon-button {
		padding: 0.25rem;
		background: none;
		border: none;
		cursor: pointer;
	}
	button.icon-button svg {
		width: 1rem;
		height: 1rem;
		fill: #333;
		transition: fill 0.2s ease;
	}
	button.icon-button:hover svg {
		fill: #ff4136;
	}
</style>
