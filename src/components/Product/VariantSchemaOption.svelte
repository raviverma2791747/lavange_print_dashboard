<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";
  import ArrowDownwardIcon from "../svg/ArrowDownwardIcon.svelte";
  import ArrowUpwardIcon from "../svg/ArrowUpwardIcon.svelte";

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

<div class="flex gap-2 text-black px-6">
  {#if !disabled}
  <div class="flex items-start">
    <button
      class="disabled:text-gray-500"
      disabled={disabledMoveUp}
      on:click={handleMoveUp}
    >
      <ArrowUpwardIcon class="w-6 h-6" />
    </button>
    <button
      class="disabled:text-gray-500"
      disabled={disabledMoveDown}
      on:click={handleMoveDown}
    >
      <ArrowDownwardIcon class="w-6 h-6" />
    </button>
  </div>
  {/if}
  <div class="mr-auto">
    <div class="text-sm font-semibold mb-2">
      {variantSchemaOption.displayName}
    </div>
    <div class="flex gap-1">
      {#each variantSchemaOption.options as option}
        <span
          class=" text-xs font-medium me-2 px-2.5 py-0.5 rounded-full no-cursor"
          class:bg-green-100={option.status === "active"}
          class:text-green-800={option.status === "active"}
          class:bg-red-100={option.status === "archive"}
          class:text-red-800={option.status === "archive"}
          class:bg-blue-100={option.status === "draft"}
          class:text-blue-800={option.status === "draft"}
          >{option.displayName}</span
        >
      {/each}
    </div>
  </div>
  {#if !disabled}
  <div class="flex gap-2 items-center justify-center">
    <button
      class="bg-blue-500 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1"
      on:click={handlEdit}
      >Edit
    </button>
    <button
      class="bg-blue-500 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 disabled:bg-blue-300"
      disabled={variantSchemaOption._id}
      on:click={handleDelete}
      >Delete
    </button>
  </div>
  {/if}
</div>
