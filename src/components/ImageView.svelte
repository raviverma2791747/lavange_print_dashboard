<script>
  //@ts-nocheck
  import { token_store } from "../helper/store";
  import Spinner from "./Spinner.svelte";
  import DeleteIcon from "./svg/DeleteIcon.svelte";
  import { httpClient } from "../helper/httpClient";
  import { getImage } from "../helper/endpoints";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let id;
  export let disabled = false;

  let loading = true;
  let error = false;
  let previewImage;

  const initImage = async (id) => {
    loading = true;
    if (id !== "create") {
      const response = await httpClient(`${getImage}/${id}`, {
        token: $token_store,
      });

      if (response.status === 200) {
        previewImage = response.data.image;
        dispatch("loaded", { previewImage });
      } else {
        error = true;
      }
    }
    loading = false;
  };

  $: {
    initImage(id);
  }
</script>

<div class="aspect-square relative">
  {#if loading}
    <Spinner />
  {:else if error}
    Error
  {:else}
    {#if previewImage}
      <img src={previewImage.url} alt={previewImage.title} />
    {:else}
      <div
        class="flex items-center justify-center border rounded-lg w-full h-full"
      >
        No Image
      </div>
    {/if}

    <div class="absolute top-0 z-20 right-0 m-2">
      <button
        {disabled}
        class="text-red-500"
        on:click={() => dispatch("delete", { id })}
      >
        <DeleteIcon />
      </button>
    </div>

    <div class="font-semibold">
      {previewImage?.title}
    </div>
  {/if}
</div>
