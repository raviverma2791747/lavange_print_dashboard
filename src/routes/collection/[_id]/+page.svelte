<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import DeleteIcon from "../../../components/svg/DeleteIcon.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import {
    getCollection,
    updateCollection,
    updateImage,
  } from "../../../helper/endpoints";
  import Editor from "../../../components/Editor.svelte";
  import slug from "slug";

  let loading = true;
  let collection_id;
  let imageInput;
  let previewImage = {
    uploading: true,
    id: "",
    url: "",
  };
  let edit = false;

  let collection = {
    name: "",
    status: "draft",
    assetId: "",
    description: "",
    slug: "",
    products: [],
  };

  const imageUpload = async () => {
    const file = imageInput.files[0];

    if (file) {
      let id = uuidv4();

      previewImage.uploading = true;

      let formData = new FormData();
      formData.append("img", file);

      const response = await httpClient(updateImage, {
        method: "POST",
        token: $token_store,
        formData: formData,
      });

      if (response.status === 200) {
        collection.assetId = response.data.img.id;
        collection.assetUrl = response.data.img.url;

        previewImage.id = collection.assetId;
        previewImage.url = collection.assetUrl;
        previewImage.uploading = false;
      } else {
      }
    }
  };

  const removeImage = async () => {
    previewImage.id = "";
    previewImage.url = "";

    collection.assetId = "";
  };

  const handleSave = async () => {
    loading = true;
    await httpClient(updateCollection, {
      method: "POST",
      token: $token_store,
      payload: collection,
    });
    loading = false;
  };

  const initCollection = async () => {
    loading = true;
    const response = await httpClient(`${getCollection}/${collection_id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      collection = response.data.collection;
    }
    loading = false;
  };

  const handleSlug = () => {
    collection.slug = slug(collection.name);
  };

  onMount(async () => {
    collection_id = $page.params._id;

    if (collection_id !== "create") {
      await initCollection();

      previewImage.id = collection.assetId;
      previewImage.url = collection.assetUrl;
      previewImage.uploading = false;
    } else {
    }

    loading = false;
    edit = true;
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Collection</h1>
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
      <!-- <h3 class="text-normal font-semibold mb-2">collection</h3> -->

      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900"
            >Name</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Title"
            bind:value={collection.name}
            disabled={!edit}
          />
        </div>

        <div class="mb-5">
          <label
            for="countries"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Select a status</label
          >
          <select
            id="status"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={collection.status}
            on:change={(e) => (collection.status = e.target.value)}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archive</option>
          </select>
        </div>

        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900"
            >Slug</label
          >
          <div class="flex gap-2">
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Slug"
              bind:value={collection.slug}
              disabled={!edit}
            />

            <button
              class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
              on:click={handleSlug}
            >
              Generate
            </button>
          </div>
        </div>

        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900"
            >Description</label
          >
          <Editor
            bind:content={collection.description}
            placeholder="Description"
          />
          <!-- <textarea
            id="description"
            rows="5"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Description"
            bind:value={collection.description}
          /> -->
        </div>

        {#if collection.assetId === ""}
          <div
            class="border border-dashed border-gray-200 rounded-lg h-48 w-48 flex justify-center items-center"
          >
            <div class="text-center">
              <label
                class="bg-purple-100 py-2 px-4 rounded-lg block text-sm text-purple-500 hover:bg-purple-300 cursor-pointer"
              >
                <input
                  type="file"
                  hidden
                  on:change={imageUpload}
                  bind:this={imageInput}
                />
                Add
              </label>

              <div class="text-sm text-gray-400">Add Annoucement Image</div>
            </div>
          </div>
        {:else}
          <div
            class="object-cover border border-gray-200 rounded-lg relative w-48 mb-4"
          >
            <img class="h-auto max-w-full rounded-lg" src={previewImage.url} />
            {#if previewImage.uploading}
              <div
                class="opacity-30 bg-gray-900 absolute w-full h-full bg-red top-0 left-0 flex justify-center items-center"
              >
                <div>
                  <Loading />
                </div>
              </div>
            {:else}
              <div class="absolute top-0 z-20 right-0 m-2">
                <button class="text-red-500" on:click={removeImage}>
                  <DeleteIcon />
                </button>
              </div>
            {/if}
          </div>
        {/if}

        <div>
          <h3 class="text-normal font-semibold mb-2">Products</h3>

          <div class="flex gap-4">
            {#each collection.products as product}
              <div class="border border-200 rounded-lg p-4">
                <div>
                  {#if product.assets.length}
                    <img
                      class="h-auto max-w-full rounded-lg"
                      src={product.assets[0].url}
                    />
                  {/if}
                </div>
                <div>
                  {product.title}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <button
    type="button"
    class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
    on:click={handleSave}
    class:hidden={!edit}
  >
    Save</button
  >
</div>
