<script>
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import { isLoading, handleNotifications } from "$lib/notification-store";
	import Notification from "./components/Notification.svelte";
	import CustomTypography from "./components/CustomTypography.svelte";
	import {
		isAuthenticated,
		principalId,
		client_canister_actor,
		client_canister,
	} from "./auth.js";
	import { Principal } from "@dfinity/principal";

	let principal = "";
	let messagesMapStore = writable(new Map());
	let loggedIn = false;

	principalId.subscribe((value) => {
		principal = value;
	});

	isAuthenticated.subscribe((value) => {
		loggedIn = value;
	});

	const TARGET_PRINCIPAL = "mmt3g-qiaaa-aaaal-qi6ra-cai";

	onMount(() => {
		handleNotificationsImpl();
	});

	async function handleNotificationsImpl() {
		isLoading.set(true);
		let actor = client_canister_actor;
		try {
			if (!client_canister_actor) {
				// @ts-ignore
				actor = await client_canister();
			}
			console.log("Getting notifications for user: ", TARGET_PRINCIPAL);
			// @ts-ignore
			let result = await actor.getNotificationsByUser(TARGET_PRINCIPAL);
			console.log("Notifications: ", result);
			if (Array.isArray(result[1])) {
				messagesMapStore.update((map) => {
					return new Map(map.set(TARGET_PRINCIPAL, result[1]));
				});
			} else {
				console.error("Unexpected result format:", result);
			}
		} catch (error) {
			console.error("Error when getting notifications: ", error);
			if (
				error instanceof TypeError &&
				error.message.includes("Failed to fetch")
			) {
				console.log(
					"This might be a CSP issue. Check your Content Security Policy.",
				);
			}
		} finally {
			isLoading.set(false);
		}
	}

	handleNotifications.set(handleNotificationsImpl);

	// @ts-ignore
	$: notifications = ($messagesMapStore.get(TARGET_PRINCIPAL) || []).map(
		// @ts-ignore
		(notification, index) => ({
			...notification,
			uniqueId: `${notification.id || ""}-${index}`,
		}),
	);

	// @ts-ignore
	async function handleReaction(event) {
		const { notificationId, reaction } = event.detail;
		console.log(`Reaction for notification ${notificationId}:`, reaction);

		try {
			let actor = client_canister_actor;
			if (!client_canister_actor) {
				// @ts-ignore
				actor = await client_canister();
			}

			const reactionData = {
				type: "Map",
				value: {
					originalNotificationId: {
						type: "Nat",
						value: notificationId.toString(),
					},
					reactionNamespace: {
						type: "Text",
						value: reaction.namespace,
					},
					reactionTemplate: {
						type: "Text",
						value: JSON.stringify(reaction.template),
					},
					reactionPrice: {
						type: "Nat",
						value: reaction.price.toString(),
					},
				},
			};

			const pub_event = {
				id: BigInt(Date.now()),
				prevId: [BigInt(notificationId)],
				timestamp: BigInt(Date.now()),
				namespace: `response.${reaction.namespace}`,
				source: Principal.fromText(TARGET_PRINCIPAL),
				data: convertToICRC16(reactionData),
				headers: [],
			};

			console.log("Publishing reaction event:", pub_event);
			// @ts-ignore
			const result = await actor.publish(pub_event);
			console.log("Reaction event published:", result);
		} catch (error) {
			console.error("Error publishing reaction event:", error);
		}
	}

	// @ts-ignore
	function convertToICRC16(data) {
		if (typeof data !== "object" || data === null) {
			return { Text: data.toString() };
		}

		if (data.type === "Map") {
			// @ts-ignore
			const convertedMap = Object.entries(data.value).map(
				// @ts-ignore
				([key, val]) => [key, convertToICRC16(val)],
			);
			return { Map: convertedMap };
		}

		if (data.type === "Array") {
			return { Array: data.value.map(convertToICRC16) };
		}

		switch (data.type) {
			case "Text":
				return { Text: data.value };
			case "Nat":
				return { Nat: BigInt(data.value) };
			case "Int":
				return { Int: BigInt(data.value) };
			case "Bool":
				return { Bool: data.value === "true" };
			default:
				return { Text: data.value.toString() };
		}
	}
</script>

<div class="notifications-container">
	<CustomTypography variant="h4">Notifications for Principal</CustomTypography
	>
	<CustomTypography variant="body1" class="principal-id"
		>{TARGET_PRINCIPAL}</CustomTypography
	>

	{#if $isLoading}
		<CustomTypography variant="body1"
			>Loading notifications...</CustomTypography
		>
	{:else if notifications.length > 0}
		<CustomTypography variant="body1" class="notification-count">
			Total notifications: {notifications.length}
		</CustomTypography>
		<div class="card-list">
			{#each notifications as notification (notification.uniqueId)}
				<Notification {notification} on:reaction={handleReaction} />
			{/each}
		</div>
	{:else}
		<CustomTypography variant="body1"
			>No notifications available for this principal</CustomTypography
		>
	{/if}
</div>

<style>
	.notifications-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	.card-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
