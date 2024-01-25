<script>
  //@ts-nocheck
  import CreateVariantConfigForm from "./CreateVariantConfigForm.svelte";
  import EditVariantConfigForm from "./EditVariantConfigForm.svelte";
  import VariantConfig from "./VariantConfig.svelte";

  export let variantConfigs;
  let create = false;
  let lock_create = false;
  let edit_variant_config_index = -1;

  const handleCreateVariantConfig = () => {
    create = true;
  };

  const handleCancelCreateVariantConfig = () => {
    create = false;
  };

  const handleSaveCreateVariantConfig = (e) => {
    variantConfigs = [...variantConfigs, e.detail.variantConfig];
    create = false;
    lock_create = true;
  };

  const handleEditVariantConfig = (e) => {
    edit_variant_config_index = e.detail.index;
  };

  const handleCancelEditVariantConfig = (e) => {
    edit_variant_config_index = -1;
  }

  const handleSaveEditVariantConfig = (e) => {
    edit_variant_config_index = -1;

  }

  const validate = (data) => {
    
  }
</script>

<div
  class="flex flex-col gap-4"
  class:mb-4={variantConfigs.length > 0 || create}
>
  {#each variantConfigs as variantConfig, index}
    {#if edit_variant_config_index === index}
      <EditVariantConfigForm
        bind:variantConfig
        on:save={handleSaveEditVariantConfig}
        on:cancel={handleCancelEditVariantConfig}
      />
    {:else}
      <VariantConfig
        {variantConfig}
        disabled={create || edit_variant_config_index !== -1}
        {index}
        on:edit={handleEditVariantConfig}
      />
    {/if}
  {/each}
  {#if create}
    <CreateVariantConfigForm
      on:save={handleSaveCreateVariantConfig}
      on:cancel={handleCancelCreateVariantConfig}
    />
  {/if}
</div>

<button
  class="text-purple-500 inline-flex cursor-pointer disabled:text-purple-300"
  on:click={handleCreateVariantConfig}
  disabled={create || edit_variant_config_index !== -1 || lock_create}
>
  Add Variant Config
</button>
