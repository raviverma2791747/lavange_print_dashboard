<script>
  //@ts-nocheck
  import VariantSchemaOption from "./VariantSchemaOption.svelte";
  import VariantTable from "./VariantTable.svelte";
  import { createEventDispatcher } from "svelte";
  import * as Select from "$lib/components/ui/select";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { STATUS } from "../../helper/constants";
  import { getByValue } from "../../helper/utils";
  const dispatch = createEventDispatcher();

  export let variantConfig;
  export let disabled;
  export let index;

  const handleEdit = () => {
    dispatch("edit", { index });
  };
</script>

<div class="border rounded-lg p-4">
  <div class="mb-4">
    <Label for="status">Status</Label>

    <Select.Root
      disabled={true}
      selected={{
        value: variantConfig.status,
        label: getByValue(STATUS, variantConfig.status),
      }}
      onSelectedChange={(v) => {
        v && (variantConfig.status = v.value);
      }}
    >
      <Select.Trigger>
        <Select.Value class="capitalize" placeholder="Status" />
      </Select.Trigger>
      <Select.Content>
        {#each Object.entries(STATUS) as [key, value]}
          <Select.Item {value} label={key} />
        {/each}
      </Select.Content>
    </Select.Root>
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
    <Button on:click={handleEdit} {disabled}>Edit</Button>
  </div>
</div>
