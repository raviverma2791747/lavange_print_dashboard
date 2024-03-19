<script>
    //@ts-nocheck
    import VariantSchemaOption from "./VariantSchemaOption.svelte";
    import CreateVariantConfigSchemaOptionForm from "./CreateVariantConfigSchemaOptionForm.svelte";
    import EditVariantConfigSchemaOptionForm from "./EditVariantConfigSchemaOptionForm.svelte";
    import VariantTable from "./VariantTable.svelte";
    import { createEventDispatcher } from "svelte";
  import EditVariantImage from "./EditVariantImage.svelte";
    const dispatch = createEventDispatcher();
  
    let create = false;
    let edit_variant_schema_option_index = -1;
    export let variantConfig;
    let variantConfigClone = structuredClone(variantConfig)
    let valid = false;
  
    const generateVariants = (variantOptions,variants) => {
      if (variantOptions.length === 0) {
        return;
      }
  
      const variantAttributes = variantOptions.map((option) =>
        option.options.map((attr) => ({ [option.name]: attr.value }))
      );
  
  
      function cartesianProduct(arr) {
        return arr.reduce(
          (a, b) => a.flatMap((x) => b.map((y) => Object.assign({}, x, y))),
          [{}]
        );
      }
  
      const allVariantsAttributes = cartesianProduct(variantAttributes);
  
      let variants_ = allVariantsAttributes.map((attributes) => {
        const sku = "";

        let variant = {
          sku,
          attributes,
          compareAtPrice: 0,
          price: 0, // Set the default price for the variant
          inventoryQuantity: 0, // Set the default inventory quantity for the variant
          assets: [],
        };

        const variant_old =  variants.find((v)=>{
         return JSON.stringify(v.attributes) === JSON.stringify(variant.attributes)
        })

        if(variant_old){
          variant = variant_old
        }
  
        return variant;
      });
  
      return variants_;
    };
  
  
    const handleCreateVariantConfigSchemaOption = () => {
      create = true;
    };
  
    const handleCreateVariantConfigSchemaOptionSave = (e) => {
      variantConfigClone.variantSchema = [
        ...variantConfigClone.variantSchema,
        e.detail.variantSchemaOption,
      ];
      create = false;
    };
  
    const handleCreateVariantConfigSchemaOptionCancel = () => {
      create = false;
    };
  
    const handleCreateVariantConfigSchemaOptionMoveUp = (e) => {
      if (e.detail.index === 1) {
        variantConfigClone.variantSchema = [
          variantConfigClone.variantSchema[e.detail.index],
          ...variantConfigClone.variantSchema.slice(0, e.detail.index),
          ...variantConfigClone.variantSchema.slice(e.detail.index + 1),
        ];
      } else {
        variantConfigClone.variantSchema = [
          ...variantConfigClone.variantSchema.slice(0, e.detail.index - 1),
          variantConfigClone.variantSchema[e.detail.index],
          variantConfigClone.variantSchema[e.detail.index - 1],
          ...variantConfigClone.variantSchema.slice(e.detail.index + 1),
        ];
      }
    };
  
    const handleCreateVariantConfigSchemaOptionMoveDown = (e) => {
      variantConfigClone.variantSchema = [
        ...variantConfigClone.variantSchema.slice(0, e.detail.index),
        variantConfigClone.variantSchema[e.detail.index + 1],
        variantConfigClone.variantSchema[e.detail.index],
        ...variantConfigClone.variantSchema.slice(e.detail.index + 2),
      ];
    };
  
    const handleEditVariantConfigSchemaOption = (e) => {
      edit_variant_schema_option_index = e.detail.index;
    };
  
    const handleEditVariantConfigSchemaOptionCancel = () => {
      edit_variant_schema_option_index = -1;
    };

    const handleEditVariantConfigSchemaOptionSave = (e) => {
    edit_variant_schema_option_index = -1;
  };


    const handleEditVariantConfigSchemaOptionDelete = (e) => {
    variantConfigClone.variantSchema = [
      ...variantConfigClone.variantSchema.slice(0, e.detail.index),
      ...variantConfigClone.variantSchema.slice(e.detail.index + 1),
    ];
  };
  
    const handleCancel = () => {
      dispatch("cancel");
    };
  
    const handleSave = () => {
      variantConfig = variantConfigClone;
      dispatch("save", { variantConfig: variantConfigClone });
    };
  
    const validate = (data) => {
      if (data.variantSchema.length === 0) {
        return false;
      }
  
      if (data.variants.length === 0) {
        return false;
      }
  
      return true;
    };
  
    $: {
      valid = validate(variantConfigClone);
    }
  
    $: {
       variantConfigClone.variants = generateVariants(variantConfigClone.variantSchema,variantConfigClone.variants) ?? [];
    }
  </script>
  
  <div class="border border-gray-200 rounded-lg p-4">
    <div class="mb-4">
      <label for="status" class="block mb-2 text-sm font-medium text-gray-900">
        Status
      </label>
      <select
        disabled={create}
        bind:value={variantConfigClone.status}
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="archive">Archive</option>
      </select>
    </div>
  
    <div class="mb-4 flex flex-col gap-4 divide-y">
      {#each variantConfigClone.variantSchema as variantSchemaOption, index}
        {#if edit_variant_schema_option_index === index}
          <EditVariantConfigSchemaOptionForm
            on:cancel={handleEditVariantConfigSchemaOptionCancel}
            on:save={handleEditVariantConfigSchemaOptionSave}
            bind:variantSchemaOption={variantSchemaOption}
          />
        {:else}
          <VariantSchemaOption
            {variantSchemaOption}
            {index}
            on:edit={handleEditVariantConfigSchemaOption}
            disabledMoveUp={index === 0 ||
              create ||
              edit_variant_schema_option_index !== -1}
            disabledMoveDown={index === variantConfigClone.variantSchema.length - 1 ||
              create ||
              edit_variant_schema_option_index !== -1}
            disabled={create || edit_variant_schema_option_index !== -1}
            on:moveUp={handleCreateVariantConfigSchemaOptionMoveUp}
            on:moveDown={handleCreateVariantConfigSchemaOptionMoveDown}
            on:delete={handleEditVariantConfigSchemaOptionDelete}
          />
        {/if}
      {/each}
      {#if create}
        <CreateVariantConfigSchemaOptionForm
          on:save={handleCreateVariantConfigSchemaOptionSave}
          on:cancel={handleCreateVariantConfigSchemaOptionCancel}
        />
      {/if}
    </div>
<!--   
    <button
      class="text-purple-500 inline-flex cursor-pointer disabled:text-purple-300 mb-4"
      on:click={handleCreateVariantConfigSchemaOption}
      disabled={create || edit_variant_schema_option_index !== -1}
    >
      Add Variant Schema Option
    </button> -->
  
    {#if variantConfigClone.variants.length > 0}
      <div class="mb-4">
        <VariantTable
          variantSchema={variantConfigClone.variantSchema}
          bind:variants={variantConfigClone.variants}

        />
      </div>
    {/if}
  
    <div class="flex gap-4">
      <button
        class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
        disabled={create || edit_variant_schema_option_index !== -1 || !valid}
        on:click={handleSave}>Done</button
      >
      <button
        class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        on:click={handleCancel}
      >
        Cancel
      </button>
    </div>
  </div>
  