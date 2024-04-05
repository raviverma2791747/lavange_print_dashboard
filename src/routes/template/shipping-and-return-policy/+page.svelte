<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Loading from "../../../components/Spinner.svelte";
    import { httpClient } from "../../../helper/httpClient";
    import { token_store } from "../../../helper/store";
    import { updateCategory, updatePolicy } from "../../../helper/endpoints";
    import ImageView from "../../../components/ImageView.svelte";
    import ImageUpload from "../../../components/ImageUpload.svelte";
    import { getPolicy } from "../../../helper/endpoints";
    import Editor from "../../../components/Editor.svelte";
  
    let loading = true;
    let edit = false;
  
    let policy = {
      name: "",
      description: "",
    };
  
    const handleSave = async () => {
      await httpClient(updatePolicy, {
        method: "POST",
        token: $token_store,
        payload: policy,
      });
    };
  
    const initPolicy = async () => {
      loading = true;
      const response = await httpClient(`${getPolicy}/shipping-and-return-policy`, {
        token: $token_store,
      });
      if (response.status === 200) {
        policy = response.data.policy;
      }
      loading = false;
    };
  
    onMount(async () => {
      await initPolicy();
    });
  </script>
  
  <div class="py-4 px-8 max-w-7xl mx-auto">
    <div class="mb-2 flex justify-between">
      <h1 class="text-2xl font-bold">Policy</h1>
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
        <!-- <h3 class="text-normal font-semibold mb-2">policy</h3> -->
  
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
              bind:value={policy.status}
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
              bind:value={policy.name}
              disabled={!edit}
            />
          </div>
  
          <div class="mb-5">
            <label
              for="description"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Description</label
            >
            <Editor
              disabled={!edit}
              bind:content={policy.description}
              placeholder="Description"
            />
          </div>
        {/if}
      </div>
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
  