<script lang="ts">
	import { dao_backend } from '../auth.js';
	import { onMount } from 'svelte';
	import { Principal } from '@dfinity/principal';

	import { ProposalType, PurposeType } from './types';

	let proposalType: ProposalType = ProposalType.OTHER;
	let purpose: PurposeType = PurposeType.TOFUND;
	let action = '';

	let description = '';
	let parameterName = '';
	let newValue = '';
	let recipient = '';
	let amount = 0;
	let purposeDescription = '';
	let wasmModule: ArrayBuffer | null = null;
	let errorMessage = '';
	let successMessage = '';

	let daoActor: any;

	onMount(async () => {
		daoActor = await dao_backend();
	});

	async function handleSubmit() {
		errorMessage = '';
		successMessage = '';

		let proposalContent: any;
		switch (proposalType) {
			case ProposalType.OTHER:
				proposalContent = { other: { action, description } };
				break;
			case ProposalType.UPDATE:
				if (!wasmModule) {
					errorMessage = 'Please upload a WASM module';
					return;
				}
				proposalContent = {
					codeUpdate: { description, wasmModule: Array.from(new Uint8Array(wasmModule)) }
				};
				break;
			case ProposalType.ADJUST:
				proposalContent = { adjustParameters: { parameterName, newValue, description } };
				break;
			case ProposalType.TRANSFER:
				proposalContent = {
					transferFunds: {
						recipient: Principal.fromText(recipient),
						amount: BigInt(amount),
						purpose: { [purpose]: purposeDescription }
					}
				};
				break;
		}

		try {
			const result = await daoActor.createProposal(proposalContent);
			if ('ok' in result) {
				successMessage = `Proposal created successfully with ID: ${result.ok}`;
			} else {
				errorMessage = `Failed to create proposal: ${JSON.stringify(result.err)}`;
			}
		} catch (error) {
			errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
		}
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				wasmModule = e.target?.result as ArrayBuffer;
			};
			reader.readAsArrayBuffer(file);
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<title>Create Proposal</title>
	<p>Create New Proposal</p>
	<select bind:value={proposalType}>
		<option value="other">Other</option>
		<option value="codeUpdate">Code Update</option>
		<option value="adjustParameters">Adjust Parameters</option>
		<option value="transferFunds">Transfer Funds</option>
	</select>

	{#if proposalType === 'other'}
		<input type="text" bind:value={action} placeholder="Action" required />
		<textarea bind:value={description} placeholder="Description" required />
	{:else if proposalType === 'codeUpdate'}
		<textarea bind:value={description} placeholder="Description" required />
		<input type="file" accept=".wasm" on:change={handleFileUpload} required />
	{:else if proposalType === 'adjustParameters'}
		<input type="text" bind:value={parameterName} placeholder="Parameter Name" required />
		<input type="text" bind:value={newValue} placeholder="New Value" required />
		<textarea bind:value={description} placeholder="Description" required />
	{:else if proposalType === 'transferFunds'}
		<input type="text" bind:value={recipient} placeholder="Recipient Principal ID" required />
		<input type="number" bind:value={amount} placeholder="Amount" required min="0" />
		<select bind:value={purpose}>
			<option value="toFund">To Fund</option>
			<option value="grantPayment">Grant Payment</option>
			<option value="serviceBill">Service Bill</option>
		</select>
		<input type="text" bind:value={purposeDescription} placeholder="Purpose Description" required />
	{/if}

	<button type="submit">Submit Proposal</button>
</form>

{#if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}

{#if successMessage}
	<p class="success">{successMessage}</p>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 500px;
		margin: 0 auto;
	}

	input,
	textarea,
	select {
		padding: 0.5rem;
		font-size: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		background-color: #4075a6;
		color: white;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background-color: #4075a6;
	}

	.error {
		color: red;
	}

	.success {
		color: green;
	}
</style>
