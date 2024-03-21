<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import {
    getAnnouncement,
    updateAnnouncement,
  } from "../../../helper/endpoints";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import ImageView from "../../../components/ImageView.svelte";
  import { goto } from "$app/navigation";

  let loading = true;
  let edit = false;
  let announcement = {
    title: "",
    status: "draft",
    asset: "",
    ctaUrl: "",
  };

  const handleRemoveImage = () => {
    announcement.asset = null;
  };

  const handleSave = async () => {
    let loading = true;
    const response = await httpClient(updateAnnouncement, {
      method: "POST",
      token: $token_store,
      payload: announcement,
    });

    if (response.status === 200) {
      goto(`/announcement/${response.data.announcement.id}`,{
        replaceState: true
      });
      edit = false;
    }
    loading = false;
  };

  const initAnnouncement = async (id) => {
    loading = true;
    const response = await httpClient(`${getAnnouncement}/${id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      announcement = response.data.announcement;
    }
    loading = false;
  };

  $: {
    if ($page.params._id !== "create") {
      initAnnouncement($page.params.id);
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Announcement</h1>
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

  <div
    class="mb-4 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
  >
    <!-- <h3 class="text-normal font-semibold mb-2">Announcement</h3> -->

    {#if loading === true}
      <Loading />
    {:else if loading === false}
      <div class="mb-5">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900"
          >Title</label
        >
        <input
          id="title"
          type="text"
          disabled={!edit}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Annoucement Title"
          bind:value={announcement.title}
        />
      </div>
      <div class="mb-5">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Select an status</label
        >
        <select
          id="status"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={announcement.status}
          disabled={!edit}
          on:change={(e) => (announcement.status = e.target.value)}
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archive">Archive</option>
        </select>
      </div>
      <div class="mb-5">
        <label for="catUrl" class="block mb-2 text-sm font-medium text-gray-900"
          >Url</label
        >
        <input
          id="catUrl"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Annoucement Url"
          disabled={!edit}
          bind:value={announcement.ctaUrl}
        />
      </div>

      {#if announcement.asset}
        <ImageView disabled={!edit}  id={announcement.asset} on:delete={handleRemoveImage} />
      {:else}
        <ImageUpload disabled={!edit}  on:success={(e) => (announcement.asset = e.detail._id)} />
      {/if}
    {/if}
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
