<script>
  //@ts-nocheck
  import VariantSchemaOption from "./VariantSchemaOption.svelte";
  import VariantTable from "./VariantTable.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let variantConfig;
  export let disabled;
  export let index;

  const handleEdit = () => {
    dispatch("edit", { index });
  };

</script>

<div class="border border-gray-200 rounded-lg p-4">
  <div class="mb-4">
    <label for="status" class="block mb-2 text-sm font-medium text-gray-900">
      Status
    </label>
    <select
      disabled={true}
      value={variantConfig.status}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
    >
      <option value="draft">Draft</option>
      <option value="active">Active</option>
      <option value="archive">Archive</option>
    </select>
  </div>

  <div class="mb-4 flex flex-col gap-4 divide-y">
    {#each variantConfig.variantSchema as variantSchemaOption, index}
      <VariantSchemaOption
        {variantSchemaOption}
        disabledMoveDown
        disabledMoveUp
        {index}
        disabled
      />
    {/each}
  </div>

  {#if variantConfig.variants.length > 0}
    <div class="mb-4">
      <VariantTable
        variantSchema={variantConfig.variantSchema}
        variants={variantConfig.variants}
        disabled={true}
      />
    </div>
    
  {/if}

  <div class="flex gap-2">
    <button
      class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
      on:click={handleEdit}
      disabled={disabled}
      >
      Edit
    </button>
  </div>
</div>
