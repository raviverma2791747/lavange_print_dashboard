<script>
  //@ts-nocheck
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Loading.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import {
    getAnnouncement,
    updateAnnouncement,
    updateImage,
  } from "../../../helper/endpoints";

  let loading = true;
  let announcement_id;
  let imageInput;
  let previewImage = {
    uploading: true,
    id: "",
    url: "",
  };

  let announcement = {
    title: "",
    status: "draft",
    assetId: "",
    assetUrl: "",
    ctaUrl: "",
  };

  const imageUpload = async () => {
    const file = imageInput.files[0];

    if (file) {
      // const reader = new FileReader();
      // reader.addEventListener("load", function () {
      //   previewImages = [
      //     ...previewImages,
      //     {
      //       uploading: false,
      //       id: reader.result,
      //       url: reader.result,
      //     },
      //   ];
      // });

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
        announcement.assetId = response.data.img.id;
        announcement.assetUrl = response.data.img.url;

        previewImage.url = response.data.img.url;
        previewImage.id = response.data.img.id;
        previewImage.uploading = false;
      } else {
      }
    }
  };

  const handleSave = async () => {
    await httpClient(updateAnnouncement, {
      method: "POST",
      token: $token_store,
      payload: announcement,
    });
  };

  onMount(async () => {
    announcement_id = $page.params._id;

    if (announcement_id !== "create") {
      const response = await httpClient(
        `${getAnnouncement}/${announcement_id}`,
        {
          token: $token_store,
        }
      );
      if(response.status === 200) {
        announcement = response.data.announcement;
        previewImage.id = announcement.assetId;
        previewImage.url = announcement.assetUrl;
        previewImage.uploading = false;
      }
    } else {
    }

    loading = false;
  });
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
  <div class="flex flex-col gap-4">
    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <!-- <h3 class="text-normal font-semibold mb-2">Announcement</h3> -->

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
            on:change={(e) => (announcement.status = e.target.value)}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900">Url</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Annoucement Url"
            bind:value={announcement.ctaUrl}
          />
        </div>
        {#if announcement.assetId === ""}
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
          <div class="object-cover border border-gray-200 rounded-lg relative">
            <img class="h-auto max-w-full" src={previewImage.url} />
            {#if previewImage.uploading}
              <div
                class="opacity-30 bg-gray-900 absolute w-full h-full bg-red top-0 left-0 flex justify-center items-center"
              >
                <div>
                  <Loading />
                </div>
              </div>
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </div>

  <button
    type="button"
    class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
    on:click={handleSave}
  >
    Save</button
  >
</div>
