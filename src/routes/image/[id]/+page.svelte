<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import {
    createImage,
    getImage,
    updateImage,
  } from "../../../helper/endpoints";
  import { token_store } from "../../../helper/store";
  import DeleteIcon from "../../../components/svg/DeleteIcon.svelte";
  import ImageView from "../../../components/ImageView.svelte";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  let loading = true;
  let edit = false;
  let previewImage = {
    uploading: true,
    title: "",
    id: "",
    url: "",
  };

  const modifyImage = async () => {
    loading = true;
    const response = await httpClient(updateImage, {
      method: "POST",
      token: $token_store,
      payload: {
        title: previewImage.title,
        id: $page.params.id,
      },
    });

    if (response.status === 200) {
      edit = false;
    }

    loading = false;
  };

  const handleSave = async () => {
    await modifyImage();
  };

  const initImage = async (id) => {
    previewImage.id = id;
    loading = false;
  };

  $: {
    if ($page.params.id !== "create") {
      initImage($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Upload Image</h1>
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
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          <div class="mb-4 h-48 w-48">
            {#if previewImage.id}
              <ImageView
                id={previewImage.id}
                disabled={!edit}
                on:loaded={(e) => {
                  loading = false;
                  previewImage = e.detail.previewImage;
                }}
              />
            {:else}
              <ImageUpload
                disabled={!edit}
                on:success={(e) => {
                  goto(`/image/${e.detail._id}`);
                  previewImage.id = e.detail._id;
                }}
              />
            {/if}
          </div>

          <div class="mb-5">
            <Label for="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Title"
              bind:value={previewImage.title}
              disabled={!edit}
            />
          </div>

          {#if edit}
            <Button on:click={handleSave}>Save</Button>
          {:else}
            <Button
              on:click={() => {
                edit = true;
              }}
            >
              Edit
            </Button>
          {/if}
        </Loading>
      </Card.Content>
    </Card.Root>
  </div>
</div>
