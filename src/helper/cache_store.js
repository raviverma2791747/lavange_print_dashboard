import { writable } from "svelte/store";

export const rights_cache = writable([]);
export const user_cache = writable(new Map());
export const product_cache = writable(new Map());
export const category_cache = writable(new Map());
export const collection_cache = writable(new Map());
export const facet_cache = writable(new Map());