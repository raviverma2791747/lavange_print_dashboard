<script>
  //@ts-nocheck
  import { httpClient } from "../../../helper/httpClient";
  import { deleteImage, fetchImage } from "../../../helper/endpoints";
  import Loading from "../../../components/Spinner.svelte";
  import DeleteIcon from "../../../components/svg/DeleteIcon.svelte";
  import ImageView from "../../../components/ImageView.svelte";
  import * as Card from "$lib/components/ui/card";

  let loading = true;
  let images = [];

  const initImages = async () => {
    loading = true;
    const response = await httpClient(fetchImage);
    if (response.status === 200) {
      images = response.data.images ?? [];
    }
    loading = false;
  };

  const removeImage = async (id) => {
    const response = await httpClient(`${deleteImage}/${id}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      await initImages();
    }
  };

  $: {
    initImages();
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Images</h1>
    <!-- <button
            type="button"
            class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            on:click={() => {
              goto("/product/create");
            }}
          >
            Add Product</button
          > -->
  </div>
  <Card.Root>
    <Card.Content class="p-4">
      <Loading {loading}>
        {#if images.length === 0}
          <p>No images found</p>
        {:else}
          <div class="grid grid-cols-4 gap-4">
            {#each images as image}
              <ImageView
                id={image._id}
                on:delete={() => removeImage(image._id)}
              />
            {/each}
          </div>
        {/if}
      </Loading>
    </Card.Content>
  </Card.Root>
</div>
