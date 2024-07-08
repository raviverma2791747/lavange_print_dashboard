<script>
    //@ts-nocheck
    import { createEventDispatcher } from "svelte";
    import ArrowDownwardIcon from "../svg/ArrowDownwardIcon.svelte";
    import ArrowUpwardIcon from "../svg/ArrowUpwardIcon.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
  
    const dispatch = createEventDispatcher();
  
    export let variantSchemaOption;
    export let index;
    export let disabledMoveUp;
    export let disabledMoveDown;
    export let disabled = false;
  
    const handleMoveUp = () => {
      dispatch("moveUp", { index });
    };
  
    const handleMoveDown = () => {
      dispatch("moveDown", { index });
    };
  
    const handlEdit = () => {
      dispatch("edit", { index });
    };
  
    const handleDelete = () => {
      dispatch("delete", { index });
    };
  </script>
  
  <div class="flex gap-2 px-6">
    {#if !disabled}
      <div class="flex items-start">
        <Button variant="ghost" disabled={disabledMoveUp} on:click={handleMoveUp}>
          <ArrowUpwardIcon class="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          disabled={disabledMoveDown}
          on:click={handleMoveDown}
        >
          <ArrowDownwardIcon class="w-6 h-6" />
        </Button>
      </div>
    {/if}
    <div class="mr-auto">
      <div class="text-sm font-semibold mb-2">
        {variantSchemaOption.displayName}
      </div>
      <div class="flex gap-1">
        {#each variantSchemaOption.options as option}
          <Badge>{option.displayName}</Badge>
        {/each}
      </div>
    </div>
    {#if !disabled}
      <div class="flex gap-2 items-center justify-center">
        <Button on:click={handlEdit}>Edit</Button>
        <Button
          variant="destructive"
          disabled={variantSchemaOption._id}
          on:click={handleDelete}
          >Delete
        </Button>
      </div>
    {/if}
  </div>
  