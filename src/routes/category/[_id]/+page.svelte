<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import {
    fetchFacet,
    getCategory,
    updateCategory,
  } from "../../../helper/endpoints";
  import slug from "slug";
  import ImageView from "../../../components/ImageView.svelte";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import Autocomplete from "../../../components/Autocomplete.svelte";
  import FacetPill from "../../../components/Category/FacetPill.svelte";
  import { facet_cache } from "../../../helper/cache_store";
  import throttle from "lodash/throttle";

  let loading = true;
  let category_id;
  let edit = false;
  let facet_input;
  let suggested_facets = [];

  let category = {
    name: "",
    facets: [],
  };

  const handleSave = async () => {
    await httpClient(updateCategory, {
      method: "POST",
      token: $token_store,
      payload: category,
    });
  };

  const initCategory = async () => {
    loading = true;
    const response = await httpClient(`${getCategory}/${category_id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      category = response.data.category;
    }
    loading = false;
  };

  const handleSlug = () => {
    category.slug = slug(category.name);
  };

  const handleRemoveImage = async () => {
    category.asset = null;
  };

  const fetchFacets = async (search) => {
    if (search) {
      const response = await httpClient(fetchFacet, {
        params: { search },
        token: $token_store,
      });

      if (response.status === 200) {
        suggested_facets = response.data.facets ?? [];
      } else {
        suggested_facets = [];
      }

      suggested_facets.forEach((facet) => {
        if (!$facet_cache.has(facet._id)) {
          $facet_cache.set(facet._id, facet);
        }
      });
    }
  };

  const handleAddFacet = async (id) => {
    if (category.facets.includes(id)) {
      facet_input = "";
      return;
    }
    category.facets = [...category.facets, id];
    facet_input = "";
  };

  const handleRemoveFacet = async (id) => {
    category.facets = category.facets.filter((facet) => facet !== id);
  };

  const throttledFetchFacets = throttle(fetchFacets, 1000, {
    leading: true,
    trailing: true,
  });

  $: {
    throttledFetchFacets(facet_input);
  }

  onMount(async () => {
    category_id = $page.params._id;

    if (category_id !== "create") {
      await initCategory();
    } else {
      edit = true;
    }

    loading = false;
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Category</h1>
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
      <!-- <h3 class="text-normal font-semibold mb-2">category</h3> -->

      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <div class="mb-4">
          <label
            for="status"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Status
          </label>
          <select
            bind:value={category.status}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Name</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={category.name}
            disabled={!edit}
          />
        </div>

        <div class="mb-2">
          <label class="block mb-2 text-sm font-medium text-gray-900"
            >Slug</label
          >
          <div class="flex gap-2">
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Slug"
              bind:value={category.slug}
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
          <label
            for="facets"
            class="block mb-2 text-sm font-medium text-gray-900">Facets</label
          >

          <div class="border rounded-lg p-2 flex gap-4 flex-wrap items-center">
            {#each category.facets as facet}
              <FacetPill
                id={facet}
                {edit}
                on:remove={() => handleRemoveFacet(facet)}
              />
            {/each}

            <div class="grow">
              <Autocomplete
                placeholder="Search Facet"
                bind:search={facet_input}
                items={suggested_facets}
                on:selected={(e) => {
                  handleAddFacet(e.detail.item._id);
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>
            </div>
            <!-- <input
              class="outline-none"
              type="text"
              bind:value={user_input}
              on:keydown={(e) => handleAddUser(e)}
              placeholder="Enter username"
            /> -->
          </div>
        </div>

        <div class="mb-2">
          {#if category.asset}
            <div class="w-48 border">
              <ImageView
                disabled={!edit}
                id={category.asset}
                on:delete={handleRemoveImage}
              />
            </div>
          {:else}
            <ImageUpload
              disabled={!edit}
              on:success={(e) => (category.asset = e.detail._id)}
            />
          {/if}
        </div>

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
