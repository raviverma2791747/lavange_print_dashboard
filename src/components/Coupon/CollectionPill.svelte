<script>
  //@ts-nocheck
  import { getCollection } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { collection_cache } from "../../helper/cache_store";
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import Spinner from "../Spinner.svelte";

  const dispatch = createEventDispatcher();

  export let id;
  export let edit;
  let loading = true;
  let collection;

  const initCollection = async (id) => {
    loading = true;
    if ($collection_cache.has(id)) {
      collection = $collection_cache.get(id);
    } else {
      const response = await httpClient(`${getCollection}/${id}`, );
      if (response.status === 200) {
        collection = response.data.collection;
      }
    }
    loading = false;
  };

  $: initCollection(id);
</script>

<div
  class="rounded-full bg-purple-100 border inline-flex items-center text-sm border-purple-300 shadow p-2 gap-2 self-center"
>
  {#if loading}
    <Spinner />
  {:else}
    <span>{collection.name}</span>
    <button
      disabled={!edit}
      on:click={() => {
        dispatch("remove", { collection });
      }}
    >
      <CloseIcon class="h-4 w-4" />
    </button>
  {/if}
</div>
