<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let search = "";
  export let items = [];
  export let placeholder = "";
</script>

<div class="relative mb-2">
  <input
    type="text"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    placeholder={placeholder}
    bind:value={search}
    on:input={(e) => {
      dispatch("input",e);
    }}
    on:blur={() => {
      setTimeout(() => {
        search = "";
      }, 200);
    }}
  />

  {#if search !== ""}
    <div
      class="absolute top-full z-20 bg-white rounded-lg w-full shadow mt-2 flex flex-col divide-y"
    >
      {#each items as item}
        <div
          class="p-2 hover:bg-gray-200 cursor-pointer flex justify-center"
          on:click={() => {
            dispatch("selected", { item });
          }}
        >
          <slot name="item" {item}>
            {item}
          </slot>
        </div>
      {/each}
    </div>
  {/if}
</div>
