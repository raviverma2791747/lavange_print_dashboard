<script>
  //@ts-nocheck
  import { updateImage } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { token_store } from "../../helper/store";
  import { v4 as uuidv4 } from "uuid";
  import Loading from "../Loading.svelte";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import { onMount } from "svelte";
  import DeleteIcon from "../svg/DeleteIcon.svelte";

  export let variants;
  export let variantSchema;
  export let active_variant_index;

  let previewImages = [];
  let imageInput;

  console.log(variants[active_variant_index]);
  console.log(variantSchema);

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

      previewImages = [
        ...previewImages,
        {
          uploading: true,
          id: id,
          url: "",
        },
      ];

      // reader.readAsDataURL(file);

      let formData = new FormData();
      formData.append("img", file);

      const response = await httpClient(updateImage, {
        method: "POST",
        token: $token_store,
        formData: formData,
      });

      if (response.status === 200) {
        variants[active_variant_index].assets = [
          ...variants[active_variant_index].assets,
          {
            id: response.data.img.id,
            url: response.data.img.url,
          },
        ];

        const previewImageIndex = previewImages.findIndex(
          (previewImage_) => previewImage_.id === id
        );

        if (previewImageIndex !== -1) {
          previewImages = [
            ...previewImages.slice(0, previewImageIndex), // Copy elements before the target
            {
              ...previewImages[previewImageIndex], // Copy the target object with updates
              id: response.data.img.id,
              url: response.data.img.url,
              uploading: false,
            },
            ...previewImages.slice(previewImageIndex + 1), // Copy elements after the target
          ];
        }
      } else {
      }
    }
  };

  const getVariantSchema = (name) => {
    return variantSchema.find((variantSchema) => {
      return variantSchema.name === name;
    });
  };

  const getVariantOption = (schema, value) => {
    return schema.options.find((option) => {
      return option.value === value;
    });
  };

  const removeImage = async (id) => {
    variants[active_variant_index].assets = variants[
      active_variant_index
    ].assets.filter((asset) => asset.id !== id);

    previewImages = previewImages.filter((previewImage) => {
      return previewImage.id !== id;
    });
  };

  onMount(() => {
    previewImages = [...variants[active_variant_index].assets];
  });
</script>

{#if active_variant_index !== -1}
  <div
    class="fixed top-0 left-0 h-screen w-screen bg-[#71717133] z-[100] flex items-center justify-center"
  >
    <div class="bg-white p-4 rounded-lg shadow w-1/2">
      <div class="flex gap-4 mb-4">
        {#each Object.entries(variants[active_variant_index].attributes) as attribute, index}
          <div class="flex">
            <div class="font-semibold capitalize">
              {getVariantSchema(attribute[0]).displayName}
            </div>
            : {getVariantOption(getVariantSchema(attribute[0]), attribute[1])
              .displayName}
          </div>
        {/each}
        <button class="ms-auto" on:click={() => (active_variant_index = -1)}>
          <CloseIcon class="w-6 h-6" /></button
        >
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {#each previewImages as previewImage}
          <div class="object-cover border border-gray-200 rounded-lg relative">
            <img
              class="h-auto max-w-full"
              src={previewImage.url}
              alt={previewImage.id}
            />
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
                <button
                  class="text-red-500"
                  on:click={() => {
                    removeImage(previewImage.id);
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            {/if}
          </div>
        {/each}
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

            <div class="text-sm text-gray-400">Images and Videos</div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
