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
    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading}
        <Loading />
      {:else}
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
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Title</label
          >
          <input
            id="title"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Title"
            bind:value={previewImage.title}
            disabled={!edit}
          />
        </div>

        <button
          class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
          class:hidden={edit}
          on:click={() => {
            edit = true;
          }}
        >
          Edit
        </button>

        <button
          type="button"
          class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
          on:click={handleSave}
          class:hidden={!edit}
        >
          Save</button
        >
      {/if}
    </div>
  </div>
</div>
