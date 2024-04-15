<script>
  //@ts-nocheck
  import Input from "$lib/components/ui/input/input.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let class_ = "";

  export { class_ as class };
  export let search = "";
  export let items = [];
  export let placeholder = "";
  export let disabled = false;
</script>

<div class="relative mb-2">
  <Input
  disabled={disabled}
    class={class_}
    type="text"
    {placeholder}
    bind:value={search}
    on:change={(e) => {
      dispatch("change", e);
    }}
    on:input={(e) => {
      dispatch("input", e);
    }}
    on:blur={() => {
      setTimeout(() => {
        search = "";
      }, 200);
    }}
  />

  {#if search !== ""}
    <div
      class="absolute top-full z-20 bg-background border rounded-lg w-full shadow mt-2 flex flex-col divide-y"
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
