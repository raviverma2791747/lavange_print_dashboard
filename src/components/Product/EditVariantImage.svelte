<script>
  //@ts-nocheck
  import CloseIcon from "../svg/CloseIcon.svelte";
  import ImageUpload from "../ImageUpload.svelte";
  import ImageView from "../ImageView.svelte";

  export let variants;
  export let variantSchema;
  export let active_variant_index;

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

  const handleRemoveImage = async (e) => {
    variants[active_variant_index].assets = variants[
      active_variant_index
    ].assets.filter((asset) => asset !== e.detail.id);
  };
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
        {#each variants[active_variant_index].assets as asset}
          <div class="w-48 border">
            <ImageView id={asset} on:delete={handleRemoveImage} />
          </div>
        {/each}

        <ImageUpload
          on:success={(e) =>
            (variants[active_variant_index].assets = [
              ...variants[active_variant_index].assets,
              e.detail._id,
            ])}
        />
      </div>
    </div>
  </div>
{/if}
