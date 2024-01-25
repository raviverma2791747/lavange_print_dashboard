<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";
  import ArrowDownwardIcon from "../svg/ArrowDownwardIcon.svelte";
  import ArrowUpwardIcon from "../svg/ArrowUpwardIcon.svelte";
  import DeleteIcon from "../svg/DeleteIcon.svelte";

  const dispatch = createEventDispatcher();

  export let option;
  export let type;
  export let index;
  export let disabledMoveDown;
  export let disabledMoveUp;

  const handleMoveUp = ()=> {
    dispatch("moveUp", { index });
  }

  const handleMoveDown = ()=> {
    dispatch("moveDown", { index });
  }

  const handleDelete = ()=> {
    dispatch("delete", { index });
  }
</script>

<div class="flex gap-2 items-center">
  <div class="flex">
    <button class="disabled:text-gray-500" disabled={disabledMoveUp} on:click={handleMoveUp}>
      <ArrowUpwardIcon class="w-6 h-6" />
    </button>
    <button class="disabled:text-gray-500" disabled={disabledMoveDown} on:click={handleMoveDown}>
      <ArrowDownwardIcon class="w-6 h-6" />
    </button>
  </div>
  <input
    type="text"
    id="title"
    class="bg-gray-50 border grow border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
    placeholder="Display name"
    bind:value={option.displayName}
  />
  {#if type === "color"}
    <input
      type="color"
      class="p-1 h-10  block bg-white border border-gray-200 cursor-pointer w-10 rounded-lg disabled:opacity-50 disabled:pointer-events-none"
      bind:value={option.value}
    />
  {:else}
    <input
      type="text"
      class="bg-gray-50 border grow border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      placeholder="Value"
      bind:value={option.value}
    />
  {/if}

  <select
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
    value={option.status}
    on:change={(e) => (option.status = e.target.value)}
  >
    <option value="active">Active</option>
    <option value="draft">Draft</option>
    <option value="archive">Archive</option>
  </select>

  <button
      class=" focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-500"
      on:click={handleDelete}
    >
      <DeleteIcon class="w-6 h-6" />
    </button>
</div>
