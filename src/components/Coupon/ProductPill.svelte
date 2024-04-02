<script>
  //@ts-nocheck
  import { getProduct } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { token_store } from "../../helper/store";
  import { product_cache } from "../../helper/cache_store";
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import Spinner from "../Spinner.svelte";

  const dispatch = createEventDispatcher();

  export let id;
  export let edit;
  let loading = true;
  let product;

  const initProduct = async (id) => {
    loading = true;
    if ($product_cache.has(id)) {
      product = $product_cache.get(id);
    } else {
      const response = await httpClient(`${getProduct}/${id}`, {
        token: $token_store,
      });
      if (response.status === 200) {
        product = response.data.product;
      }
    }
    loading = false;
  };

  $: initProduct(id);
</script>

<div
  class="rounded-full bg-purple-100 border inline-flex items-center text-sm border-purple-300 shadow p-2 gap-2 self-center"
>
  {#if loading}
    <Spinner />
  {:else}
    <span>{product.title}</span>
    <button
      disabled={!edit}
      on:click={() => {
        dispatch("remove", { product });
      }}
    >
      <CloseIcon class="h-4 w-4" />
    </button>
  {/if}
</div>
