<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";
  import { createImage } from "../helper/endpoints";

  import { httpClient } from "../helper/httpClient";

  import Loading from "./Loading.svelte";
  import Spinner from "./Spinner.svelte";

  const dispatch = createEventDispatcher();

  export let disabled = false;
  let imageInput;
  let loading = false;

  const imageUpload = async () => {
    loading = true;
    const file = imageInput.files[0];

    if (file) {
      let formData = new FormData();
      formData.append("img", file);
      formData.append("title", "");

      const response = await httpClient(createImage, {
        method: "POST",
        formData: formData,
      });

      if (response.status === 200) {
        dispatch("success", response.data.image);
      } else {
      }

      loading = false;
    }
  };
</script>

{#if loading}
  <div
    class="h-48 w-48 rounded-lg flex justify-center items-center border text-gray-400"
  >
    <div>
      <Spinner />
      {#if imageInput && imageInput.files.length}
        <div>
          {imageInput.files[0].name}
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div
    class="border border-dashed  rounded-lg h-48 w-48 flex justify-center items-center"
  >
    <div class="text-center">
      <label
        class="bg-purple-100 py-2 px-4 rounded-lg block text-sm text-purple-500 hover:bg-purple-300 cursor-pointer"
      >
        <input
          type="file"
          hidden
          disabled={disabled}
          bind:this={imageInput}
          on:change={imageUpload}
        />
        Add
      </label>

      <div class="text-sm ">Add Image</div>
      <div class="text-sm ">Max. 5mb</div>
    </div>
  </div>
{/if}
