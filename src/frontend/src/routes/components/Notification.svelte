<script>
	// @ts-nocheck

	import { createEventDispatcher } from "svelte";
	import CustomTypography from "./CustomTypography.svelte";
	import ReactionDisplay from "./ReactionDisplay.svelte";

	// @ts-ignore
	export let notification;

	const dispatch = createEventDispatcher();

	let parsedContent = "";
	// @ts-ignore
	let parsedReactions = [];
	let showDetails = false;

	// @ts-ignore
	$: {
		parseNotificationData(notification.data);
	}

	// @ts-ignore
	function parseICRC16Value(value) {
		if (typeof value === "object" && value !== null) {
			if ("Text" in value) return value.Text;
			if ("Nat" in value) return BigInt(value.Nat).toString();
			if ("Int" in value) return value.Int;
			if ("Bool" in value) return value.Bool;
			if ("Array" in value) return value.Array.map(parseICRC16Value);
			if ("Map" in value) {
				return new Map(
					// @ts-ignore
					value.Map.map(([k, v]) => [k, parseICRC16Value(v)]),
				);
			}
			// Обработка случая, когда значение уже является Map
			if (value instanceof Map) {
				return new Map(
					// @ts-ignore
					[...value].map(([k, v]) => [k, parseICRC16Value(v)]),
				);
			}
			// Обработка случая, когда значение уже является массивом или объектом
			if (Array.isArray(value)) {
				return value.map(parseICRC16Value);
			}
			if (typeof value === "object") {
				return new Map(
					// @ts-ignore
					Object.entries(value).map(([k, v]) => [
						k,
						parseICRC16Value(v),
					]),
				);
			}
		}
		return value;
	}

	// @ts-ignore
	function parseNotificationData(data) {
		// console.log('Raw notification data:', data);
		const parsedData = parseICRC16Value(data);
		// console.log('Parsed notification data:', parsedData);

		if (parsedData instanceof Map) {
			parsedContent = parsedData.get("content") || "";
			const expectedReactions = parsedData.get("expectedReactions") || [];
			parsedReactions = expectedReactions
				// @ts-ignore
				.map((reaction) => {
					if (reaction instanceof Map) {
						return {
							namespace: reaction.get("namespace") || "",
							template:
								parseICRC16Value(reaction.get("template")) ||
								"",
							price: reaction.get("price") || 0,
							recipient: reaction.get("recipient") || "",
						};
					}
					return null;
				})
				// @ts-ignore
				.filter((r) => r !== null);
		}
		// @ts-ignore
		// console.log("Parsed reactions:", parsedReactions);
	}

	function toggleDetails() {
		showDetails = !showDetails;
	}

	// @ts-ignore
	function formatTimestamp(timestamp) {
		return new Date(Number(timestamp)).toLocaleString();
	}

	// @ts-ignore
	function handleReaction(event) {
		dispatch("reaction", {
			// @ts-ignore
			notificationId: notification.id,
			reaction: event.detail,
		});
	}

	// @ts-ignore
	function renderICRC16(data) {
		const parsed = parseICRC16Value(data);
		return JSON.stringify(
			parsed,
			// @ts-ignore
			(key, value) =>
				value instanceof Map ? Object.fromEntries(value) : value,
			2,
		);
	}
</script>

<div class="card">
	<CustomTypography variant="h6" class="card-title">
		Notification ID: {notification.eventId}
	</CustomTypography>
	<CustomTypography variant="body2">
		Timestamp: {formatTimestamp(notification.timestamp)}
	</CustomTypography>
	<CustomTypography variant="body2">
		Namespace: {notification.namespace}
	</CustomTypography>

	{#if parsedContent}
		<CustomTypography variant="body1" class="content">
			Content: {parsedContent}
		</CustomTypography>
	{/if}

	<button on:click={toggleDetails}>
		{showDetails ? "Hide Details" : "Show Details"}
	</button>

	{#if showDetails}
		<details open>
			<summary>Notification Details</summary>
			<div class="data-section">
				<CustomTypography variant="body2">Data:</CustomTypography>
				<pre>{renderICRC16(notification.data)}</pre>
			</div>
			{#if notification.headers}
				<div class="headers-section">
					<CustomTypography variant="body2">Headers:</CustomTypography
					>
					<pre>{renderICRC16(notification.headers)}</pre>
				</div>
			{/if}
		</details>

		{#if parsedReactions.length > 0}
			<div class="reactions-section">
				<CustomTypography variant="body2"
					>Available Reactions:</CustomTypography
				>
				<ReactionDisplay
					reactions={parsedReactions}
					on:reaction={handleReaction}
				/>
			</div>
		{/if}
	{/if}
</div>

<style>
	.card {
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 20px;
		margin-bottom: 20px;
		transition: transform 0.3s ease;
	}

	.card:hover {
		transform: translateY(-5px);
	}

	/* .card-title {
		margin-bottom: 10px;
	}

	.content {
		margin-top: 10px;
		font-weight: bold;
	} */

	button {
		background-color: #4caf50;
		border: none;
		color: white;
		padding: 10px 15px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 14px;
		margin: 10px 0;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #45a049;
	}

	details {
		margin-top: 15px;
	}

	summary {
		cursor: pointer;
		color: #3498db;
	}

	.data-section,
	.headers-section,
	.reactions-section {
		background-color: #f8f9fa;
		border-radius: 4px;
		padding: 10px;
		margin-top: 10px;
	}

	pre {
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
