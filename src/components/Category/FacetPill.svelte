<script>
  //@ts-nocheck
  import { getFacet } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { facet_cache } from "../../helper/cache_store";
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import Spinner from "../Spinner.svelte";

  const dispatch = createEventDispatcher();

  export let id;
  export let edit;
  let loading = true;
  let facet;

  const initFacet = async (id) => {
    loading = true;
    if ($facet_cache.has(id)) {
      facet = $facet_cache.get(id);
    } else {
      const response = await httpClient(`${getFacet}/${id}`);
      if (response.status === 200) {
        facet = response.data.facet;
      }
    }
    loading = false;
  };

  $: initFacet(id);
</script>

<div
  class="rounded-full bg-purple-100 border inline-flex items-center text-sm border-purple-300 shadow p-2 gap-2 self-center"
>
  {#if loading}
    <Spinner />
  {:else}
    <span>{facet.displayName}</span>
    <span>{facet.name}</span>
    <button
      disabled={!edit}
      on:click={() => {
        dispatch("remove", { facet });
      }}
    >
      <CloseIcon class="h-4 w-4" />
    </button>
  {/if}
</div>
