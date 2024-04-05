<script>
  //@ts-nocheck
  import { getCategory } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { token_store } from "../../helper/store";
  import { category_cache } from "../../helper/cache_store";
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import Spinner from "../Spinner.svelte";

  const dispatch = createEventDispatcher();

  export let id;
  export let edit;
  let loading = true;
  let category;

  const initCategory = async (id) => {
    loading = true;
    if ($category_cache.has(id)) {
      category = $category_cache.get(id);
    } else {
      const response = await httpClient(`${getCategory}/${id}`, {
        token: $token_store,
      });
      if (response.status === 200) {
        category = response.data.category;
      }
    }
    loading = false;
  };

  $: initCategory(id);
</script>

<div
  class="rounded-full bg-purple-100 border inline-flex items-center text-sm border-purple-300 shadow p-2 gap-2 self-center"
>
  {#if loading}
    <Spinner />
  {:else}
    <span>{category.name}</span>
    <button
      disabled={!edit}
      on:click={() => {
        dispatch("remove", { category });
      }}
    >
      <CloseIcon class="h-4 w-4" />
    </button>
  {/if}
</div>
