<script>
  //@ts-nocheck
  import Button from "$lib/components/ui/button/button.svelte";
  import { createEventDispatcher } from "svelte";
  import Faq from "./Faq.svelte";
  import ArrowUpwardIcon from "../../svg/ArrowUpwardIcon.svelte";
  import ArrowDownwardIcon from "../../svg/ArrowDownwardIcon.svelte";
  export let topic;
  export let key;
  export let disabled;
  export let disableUp = false;
  export let disableDown = false;

  const dispatch = createEventDispatcher();
</script>

<div class="flex gap-2">
  <div class="flex items-start">
    <Button
      class="p-1"
      variant="ghost"
      on:click={() => dispatch("up", { key })}
      disabled={disableUp || disabled}
    >
      <ArrowUpwardIcon class="w-6 h-6" />
    </Button>
    <Button
      class="p-1"
      variant="ghost"
      on:click={() => dispatch("down", { key })}
      disabled={disableDown || disabled}
    >
      <ArrowDownwardIcon class="w-6 h-6" />
    </Button>
  </div>
  <div class="border rounded-lg p-4 grow">
    <h2 class="text-xl font-semibold mb-2">{topic.title}</h2>

    <hr class="mb-2" />
    <div class="flex flex-col space-y-4 mb-2">
      {#each topic.faqs as faq}
        <Faq {faq} disabled />
      {/each}
    </div>
    <hr class="mb-4" />
    <div>
      <Button on:click={() => dispatch("edit", { key })} {disabled}>Edit</Button
      >
      <Button
        variant="destructive"
        on:click={() => dispatch("delete", { key })}
        {disabled}>Delete</Button
      >
    </div>
  </div>
</div>
