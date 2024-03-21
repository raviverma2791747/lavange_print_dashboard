<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import { getCollection, updateCollection } from "../../../helper/endpoints";
  import Editor from "../../../components/Editor.svelte";
  import slug from "slug";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import ImageView from "../../../components/ImageView.svelte";

  let loading = true;
  let edit = false;

  let collection = {
    name: "",
    status: "draft",
    asset: "",
    description: "",
    slug: "",
    products: [],
  };

  const handleRemoveImage = async () => {
    collection.asset = null;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateCollection, {
      method: "POST",
      token: $token_store,
      payload: collection,
    });

    if (response.status === 200) {
      goto(`/collection/${response.data.collection.id}`, {
        replaceState: true,
      });
      edit = false;
    }

    loading = false;
  };

  const initCollection = async (id) => {
    loading = true;
    const response = await httpClient(`${getCollection}/${id}`, {
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

  $: {
    if ($page.params._id !== "create") {
      initCollection($page.params.id);
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Collection</h1>
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
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
            >Name</label
          >
          <input
            id="name"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Title"
            bind:value={collection.name}
            disabled={!edit}
          />
        </div>

        <div class="mb-5">
          <label
            for="status"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Select a status</label
          >
          <select
            id="status"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={collection.status}
            disabled={!edit}
            on:change={(e) => (collection.status = e.target.value)}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archive</option>
          </select>
        </div>

        <div class="mb-5">
          <label for="slug" class="block mb-2 text-sm font-medium text-gray-900"
            >Slug</label
          >
          <div class="flex gap-2">
            <input
              id="slug"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Slug"
              bind:value={collection.slug}
              disabled={!edit}
            />

            <button
              disabled={!edit}
              class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
              on:click={handleSlug}
            >
              Generate
            </button>
          </div>
        </div>

        <div class="mb-5">
          <label
            for="description"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Description</label
          >
          <Editor
            disabled={!edit}
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

        <div>
          {#if collection.asset}
            <div class="w-48 border">
              <ImageView
                disabled={!edit}
                id={collection.asset}
                on:delete={handleRemoveImage}
              />
            </div>
          {:else}
            <ImageUpload
              disabled={!edit}
              on:success={(e) => (collection.asset = e.detail._id)}
            />
          {/if}
        </div>
      {/if}
    </div>
    <!-- <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Loading />{:else}
        <h3 class="text-normal font-semibold mb-2">Products</h3>

        <div class="grid grid-cols-6 gap-4">
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
      {/if}
    </div> -->
  </div>

  {#if edit}
    <button
      type="button"
      class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      on:click={handleSave}
    >
      Save</button
    >
  {:else}
    <button
      class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
      on:click={() => {
        edit = true;
      }}
    >
      Edit
    </button>
  {/if}
</div>
