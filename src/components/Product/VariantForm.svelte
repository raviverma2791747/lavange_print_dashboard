<script>
  //@ts-nocheck
  import Button from "$lib/components/ui/button/button.svelte";
  import { createEventDispatcher } from "svelte";
  import VariantSchema from "./VariantSchema.svelte";
  import VariantSchemaForm from "./VariantSchemaForm.svelte";

  const dispatch = createEventDispatcher();

  export let variantSchema = [];
  export let disabled = false;
  let create = false;
  let edit_variant_schema_item_index = -1;
</script>

<div>
  {#each variantSchema as variantSchemaItem, key}
    {#if edit_variant_schema_item_index === key}
      <VariantSchemaForm
        {variantSchemaItem}
        {key}
        on:save={({ detail }) => {
          variantSchema[edit_variant_schema_item_index] =
            detail.variantSchemaItem;
          edit_variant_schema_item_index = -1;
        }}
        on:cancel={() => {
          edit_variant_schema_item_index = -1;
        }}
      />
    {:else}
      <VariantSchema
        {variantSchemaItem}
        {key}
        {disabled}
        disabledMoveUp={key === 0}
        disabledMoveDown={key === variantSchema.length - 1}
        on:edit={({ detail }) => {
          edit_variant_schema_item_index = detail.key;
        }}
        on:moveUp={({ detail }) => {
          const temp = variantSchema[detail.key - 1];
          variantSchema[detail.key - 1] = variantSchema[detail.key];
          variantSchema[detail.key] = temp;
        }}
        on:moveDown={({ detail }) => {
          const temp = variantSchema[detail.key + 1];
          variantSchema[detail.key + 1] = variantSchema[detail.key];
          variantSchema[detail.key] = temp;
        }}
        on:delete={({ detail }) => {
          variantSchema = variantSchema.filter(
            (item, index) => index !== detail.key
          );
        }}
      />
    {/if}
  {/each}
  {#if create}
    <VariantSchemaForm
      on:save={({ detail }) => {
        variantSchema = [...variantSchema, detail.variantSchemaItem];
        create = false;
      }}
      on:cancel={() => (create = false)}
    />
  {:else}
    <Button variant="ghost" on:click={() => (create = true)} {disabled}
      >Add Variant</Button
    >
  {/if}
</div>
