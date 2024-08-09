<script>
	import { onMount } from 'svelte';
	import { Principal } from '@dfinity/principal';
	import { broadcaster, broadcaster_canister_actor } from '../auth.js';
	import ReactionDisplay from './ReactionDisplay.svelte';

	let publishing = false;
	let result = '';
	let parsedContent = '';
	let parsedReactions = [];

	const client_canister = 'mmt3g-qiaaa-aaaal-qi6ra-cai';

	function convertToICRC16(data) {
		switch (data.type) {
			case 'Text':
				return { Text: data.value };
			case 'Nat':
				return { Nat: BigInt(data.value) };
			case 'Int':
				return { Int: BigInt(data.value) };
			case 'Bool':
				return { Bool: data.value === 'true' };
			case 'Map':
				return {
					Map: Object.entries(data.value).map(([key, val]) => [key, convertToICRC16(val)])
				};
			case 'Array':
				return {
					Array: data.value.map((item) => convertToICRC16(item))
				};
			default:
				return { Text: data.value };
		}
	}

	const testData = {
		id: 12,
		prevId: 0,
		timestamp: 1625097600000000,
		namespace: 'test',
		data: {
			type: 'Map',
			value: {
				content: { type: 'Text', value: 'Test message with reaction' },
				expectedReactions: {
					type: 'Array',
					value: [
						{
							type: 'Map',
							value: {
								namespace: { type: 'Text', value: 'feedback.test' },
								template: { type: 'Text', value: 'TextFeedback' },
								price: { type: 'Nat', value: '10' },
								recipient: { type: 'Principal', value: 'mmt3g-qiaaa-aaaal-qi6ra-cai' }
							}
						},
						{
							type: 'Map',
							value: {
								namespace: { type: 'Text', value: 'rating.namespace' },
								template: { type: 'Text', value: 'LikeDislike' },
								price: { type: 'Nat', value: '1' },
								recipient: { type: 'Principal', value: 'mmt3g-qiaaa-aaaal-qi6ra-cai' }
							}
						},
						{
							type: 'Map',
							value: {
								namespace: { type: 'Text', value: 'registration.test' },
								template: {
									type: 'Map',
									value: {
										type: { type: 'Text', value: 'RegistrationForm' },
										fields: {
											type: 'Array',
											value: [
												{
													type: 'Map',
													value: {
														name: { type: 'Text', value: 'Full Name' },
														fieldType: { type: 'Text', value: 'Text' },
														required: { type: 'Bool', value: 'true' }
													}
												},
												{
													type: 'Map',
													value: {
														name: { type: 'Text', value: 'Age' },
														fieldType: { type: 'Text', value: 'Number' },
														required: { type: 'Bool', value: 'true' }
													}
												},
												{
													type: 'Map',
													value: {
														name: { type: 'Text', value: 'Subscribe to hackathon' },
														fieldType: { type: 'Text', value: 'Boolean' },
														required: { type: 'Bool', value: 'false' }
													}
												}
											]
										}
									}
								},
								price: { type: 'Nat', value: '20' },
								recipient: { type: 'Principal', value: 'mmt3g-qiaaa-aaaal-qi6ra-cai' }
							}
						},
						{
							type: 'Map',
							value: {
								namespace: { type: 'Text', value: 'custom.test' },
								template: {
									type: 'Map',
									value: {
										type: { type: 'Text', value: 'Custom' },
										details: { type: 'Text', value: 'Custom reaction template' }
									}
								},
								price: { type: 'Nat', value: '50' },
								recipient: { type: 'Principal', value: 'mmt3g-qiaaa-aaaal-qi6ra-cai' }
							}
						}
					]
				}
			}
		},
		headers: [{ fieldName: 'Content-Type', fieldType: 'Text', fieldValue: 'application/json' }]
	};

	function bigIntReplacer(key, value) {
		if (typeof value === 'bigint') {
			return value.toString() + 'n';
		}
		return value;
	}

	function parsePublicationResult(data) {
		if (typeof data === 'object' && data !== null) {
			if ('Map' in data) {
				const map = new Map(data.Map);
				parsedContent = map.get('content')?.Text || '';
				const expectedReactions = map.get('expectedReactions')?.Array || [];
				parsedReactions = expectedReactions
					.map((reaction) => {
						if ('Map' in reaction) {
							const reactionMap = new Map(reaction.Map);
							return {
								namespace: reactionMap.get('namespace')?.Text || '',
								template:
									reactionMap.get('template')?.Text || reactionMap.get('template')?.Map || '',
								price: reactionMap.get('price')?.Nat || 0,
								recipient: reactionMap.get('recipient')?.Principal || ''
							};
						}
						return null;
					})
					.filter((r) => r !== null);
			}
		}
	}

	function handleReaction(event) {
		console.log('Reaction selected:', event.detail);
		// Here you can implement logic to create a new publication based on the selected reaction
	}

	async function sendTestPublication() {
		publishing = true;
		result = '';
		try {
			const event = {
				id: Number(testData.id),
				prevId: [Number(testData.prevId)],
				timestamp: BigInt(testData.timestamp),
				namespace: testData.namespace,
				source: Principal.fromText(client_canister),
				data: convertToICRC16(testData.data),
				headers:
					testData.headers.length > 0
						? [
								testData.headers.map((h) => [
									h.fieldName,
									convertToICRC16({ type: h.fieldType, value: h.fieldValue })
								])
							]
						: []
			};
			let actor = broadcaster_canister_actor;
			if (!broadcaster_canister_actor) {
				actor = await broadcaster();
			}
			const publishResult = await actor.publish(event);
			result = `Publication sent successfully. Result: ${JSON.stringify(publishResult, bigIntReplacer)}`;
		} catch (error) {
			result = `Error sending publication: ${error.message}`;
		} finally {
			publishing = false;
		}
	}
</script>

<div class="test-publication">
	<h2>Test Publication</h2>
	<pre>{JSON.stringify(testData, null, 2)}</pre>
	<button on:click={sendTestPublication} disabled={publishing}>
		{publishing ? 'Sending...' : 'Send Test'}
	</button>
	{#if result}
		<div class="result">
			<h3>Result:</h3>
			<pre>{result}</pre>
		</div>
	{/if}
	{#if parsedContent}
		<div class="parsed-content">
			<h3>Content:</h3>
			<p>{parsedContent}</p>
		</div>
	{/if}
	{#if parsedReactions.length > 0}
		<div class="parsed-reactions">
			<h3>Available Reactions:</h3>
			<ReactionDisplay reactions={parsedReactions} on:reaction={handleReaction} />
		</div>
	{/if}
</div>

<style>
	.test-publication {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
	}
	pre {
		background-color: #f4f4f4;
		padding: 10px;
		border-radius: 5px;
		overflow-x: auto;
	}
	button {
		background-color: #4caf50;
		border: none;
		color: white;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 4px;
	}
	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
	.result,
	.parsed-content,
	.parsed-reactions {
		margin-top: 20px;
	}
</style>
