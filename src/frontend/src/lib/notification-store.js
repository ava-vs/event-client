import { writable } from 'svelte/store';

export const isLoading = writable(false);
export const handleNotifications = writable(() => { });
export const nextNotification = writable(0);
