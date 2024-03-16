import { writable } from "svelte/store";

export const token_store = writable(null);
export const user_info_store = writable(null);
export const notifications_store = writable([]);