<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Spinner from "../../../components/Spinner.svelte";
  import { getFacet, updateFacet } from "../../../helper/endpoints";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";

  let facet = {
    name: "",
    displayName: "",
    type: "other",
    options: [],
  };
  let edit;
  let loading;

  const handleAddFacetOption = () => {
    facet.options = [
      ...facet.options,
      {
        displayName: "",
        value: "",
      },
    ];
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateFacet, {
      method: "POST",
      token: $token_store,
      payload: facet,
    });

    if (response.status === 200) {
      goto(`/facet/${response.data.facet.id}`, {
        replaceState: true,
      });
      edit = false;
    }

    loading = false;
  };

  const initFacet = async (id) => {
    loading = true;
    const response = await httpClient(`${getFacet}/${id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      facet = response.data.facet;
    }
    loading = false;
  };

  $: {
    if ($page.params.id !== "create") {
      initFacet($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Facet</h1>
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
        <Spinner />
      {:else}
        <div class="mb-2">
          <label
            for="facets"
            class="block mb-2 text-sm font-medium text-gray-900">Facets</label
          >

          <div class="flex flex-col gap-2 mb-2">
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="mb-2">
                <div class="flex gap-2">
                  <input
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Display Name"
                    bind:value={facet.displayName}
                    disabled={!edit}
                  />

                  <input
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Name"
                    bind:value={facet.name}
                    disabled={!edit}
                  />

                  <select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={facet.type}
                    on:change={(e) => (facet.type = e.target.value)}
                  >
                    <option value="color">Color</option>
                    <option value="size">Size</option>
                    <option value="material">Material</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div class="mb-2">
                <div class="flex flex-col gap-2 mb-2">
                  {#each facet.options as option}
                    <div class="flex gap-2">
                      <input
                        type="text"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Option Display Name"
                        bind:value={option.displayName}
                        disabled={!edit}
                      />

                      {#if facet.type === "color"}
                        <input
                          type="color"
                          class="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer w-10 rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                          bind:value={option.value}
                        />
                      {:else}
                        <input
                          type="text"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Option Value"
                          bind:value={option.value}
                          disabled={!edit}
                        />
                      {/if}

                      <button
                        class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
                      >
                        Remove
                      </button>
                    </div>
                  {/each}
                </div>
              </div>

              <button
                disabled={!edit}
                class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
                on:click={() => handleAddFacetOption()}
              >
                Add Options
              </button>
            </div>
          </div>
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
