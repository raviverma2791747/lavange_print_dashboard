<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Loading.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { getTag, updateTag } from "../../../helper/endpoints";
  import { token_store } from "../../../helper/store";


  let tag_id;
  let loading = true;
  let edit = false;

  let tag = {
    name: "",
  };

  const handleSave = async () => {
    await httpClient(updateTag, {
      method: "POST",
      token: $token_store,
      payload: tag,
    });
  };

  const initTag = async () => {
    loading = true;
    const response = await httpClient(`${getTag}/${tag_id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      tag = response.data.tag;
    }
    loading = false;
  };

  onMount(async () => {
    tag_id = $page.params._id;
    if (tag_id !== "create") {
      await initTag();
    } else {
      edit = true;
    }

    loading = false;
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Tag</h1>
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
      <!-- <h3 class="text-normal font-semibold mb-2">tag</h3> -->

      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Title</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Annoucement Title"
            bind:value={tag.name}
            disabled={!edit}
          />
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
