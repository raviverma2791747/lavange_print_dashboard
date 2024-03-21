<script>
  //@ts-nocheck
  import VariantSchemaOption from "./VariantSchemaOption.svelte";
  import CreateVariantConfigSchemaOptionForm from "./CreateVariantConfigSchemaOptionForm.svelte";
  import EditVariantConfigSchemaOptionForm from "./EditVariantConfigSchemaOptionForm.svelte";
  import VariantTable from "./VariantTable.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let create = false;
  let edit_variant_schema_option_index = -1;
  let variantConfig = {
    status: "draft",
    variantSchema: [],
    variants: [],
  };
  let valid = false;

  const generateVariants = (variantOptions) => {
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
      // `${product.title}-${Object.entries(attributes)
      //   .map(([key, value]) => `${key}-${value}`)
      //   .join("-")}`;

      //let old_variant = product_.variants.find(())
      let variant = {
        assets: [],
        sku,
        attributes,
        price: 0, // Set the default price for the variant
        inventoryQuantity: 0, // Set the default inventory quantity for the variant
      };

      // const newAttributes = variantOptions.map((variantOption) => {
      //   return variantOption.name;
      // });

      // const oldAttributes = product_.variantOptions.map((variantOption) => {
      //   return variantOption.name;
      // });

      // console.log(newAttributes)
      // console.log(oldAttributes)

      //   const oldVariantAttributes = product_.variantOptions.map((option) =>
      //   option.options.map((attr) => ({ [option.name]: attr.value }))
      // );

      // console.log(variantAttributes)
      // console.log(oldVariantAttributes)

      // const oldSet = new Set(oldAttributes)
      // const newSet = new Set(newAttributes)

      // const commonSet  = new Set([...oldSet].filter(x => newSet.has(x)))

      // const commonAttributes = [...commonSet]

      return variant;
    });

    return variants_;
  };

  const handleCreateVariantConfigSchemaOption = () => {
    create = true;
  };

  const handleCreateVariantConfigSchemaOptionSave = (e) => {
    variantConfig.variantSchema = [
      ...variantConfig.variantSchema,
      e.detail.variantSchemaOption,
    ];
    create = false;
  };

  const handleCreateVariantConfigSchemaOptionCancel = () => {
    create = false;
  };

  const handleCreateVariantConfigSchemaOptionMoveUp = (e) => {
    if (e.detail.index === 1) {
      variantConfig.variantSchema = [
        variantConfig.variantSchema[e.detail.index],
        ...variantConfig.variantSchema.slice(0, e.detail.index),
        ...variantConfig.variantSchema.slice(e.detail.index + 1),
      ];
    } else {
      variantConfig.variantSchema = [
        ...variantConfig.variantSchema.slice(0, e.detail.index - 1),
        variantConfig.variantSchema[e.detail.index],
        variantConfig.variantSchema[e.detail.index - 1],
        ...variantConfig.variantSchema.slice(e.detail.index + 1),
      ];
    }
  };

  const handleCreateVariantConfigSchemaOptionMoveDown = (e) => {
    variantConfig.variantSchema = [
      ...variantConfig.variantSchema.slice(0, e.detail.index),
      variantConfig.variantSchema[e.detail.index + 1],
      variantConfig.variantSchema[e.detail.index],
      ...variantConfig.variantSchema.slice(e.detail.index + 2),
    ];
  };

  const handleEditVariantConfigSchemaOption = (e) => {
    edit_variant_schema_option_index = e.detail.index;
  };

  const handleEditVariantConfigSchemaOptionCancel = () => {
    edit_variant_schema_option_index = -1;
  };

  const handleEditVariantConfigSchemaOptionSave = (e) => {
    // variantConfig.variantSchema = [
    //   ...variantConfig.variantSchema.slice(0, e.detail.index),
    //   e.detail.variantSchemaOption,
    //   ...variantConfig.variantSchema.slice(e.detail.index + 1),
    // ];
    edit_variant_schema_option_index = -1;
  };

  const handleCreateVariantConfigSchemaOptionDelete = (e) => {
    variantConfig.variantSchema = [
      ...variantConfig.variantSchema.slice(0, e.detail.index),
      ...variantConfig.variantSchema.slice(e.detail.index + 1),
    ];
  };

  const handleCancel = () => {
    dispatch("cancel");
  };

  const handleSave = () => {
    dispatch("save", { variantConfig });
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
    valid = validate(variantConfig);
  }

  $: {
    variantConfig.variants =
      generateVariants(variantConfig.variantSchema) ?? [];
  }
</script>

<div class="border border-gray-200 rounded-lg p-4">
  <div class="mb-4">
    <label for="status" class="block mb-2 text-sm font-medium text-gray-900">
      Status
    </label>
    <select
      disabled={create}
      bind:value={variantConfig.status}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
    >
      <option value="draft">Draft</option>
      <option value="active">Active</option>
      <option value="archive">Archive</option>
    </select>
  </div>

  <div class="mb-4 flex flex-col gap-4">
    {#each variantConfig.variantSchema as variantSchemaOption, index}
      {#if edit_variant_schema_option_index === index}
        <EditVariantConfigSchemaOptionForm
          on:save={handleEditVariantConfigSchemaOptionSave}
          on:cancel={handleEditVariantConfigSchemaOptionCancel}
          bind:variantSchemaOptionClone={variantSchemaOption}
        />
      {:else}
        <VariantSchemaOption
          {variantSchemaOption}
          {index}
          on:edit={handleEditVariantConfigSchemaOption}
          disabledMoveUp={index === 0 ||
            create ||
            edit_variant_schema_option_index !== -1}
          disabledMoveDown={index === variantConfig.variantSchema.length - 1 ||
            create ||
            edit_variant_schema_option_index !== -1}
          disabled={create || edit_variant_schema_option_index !== -1}
          on:moveUp={handleCreateVariantConfigSchemaOptionMoveUp}
          on:moveDown={handleCreateVariantConfigSchemaOptionMoveDown}
          on:delete={handleCreateVariantConfigSchemaOptionDelete}
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

  <button
    class="text-purple-500 inline-flex cursor-pointer disabled:text-purple-300 mb-4"
    on:click={handleCreateVariantConfigSchemaOption}
    disabled={create || edit_variant_schema_option_index !== -1}
  >
    Add Variant Schema Option
  </button>

  {#if variantConfig.variants.length > 0}
    <div class="mb-4">
      <VariantTable
        variantSchema={variantConfig.variantSchema}
        variants={variantConfig.variants}
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
