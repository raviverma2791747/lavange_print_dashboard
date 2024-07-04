<script>
  //@ts-nocheck
  import Button from "$lib/components/ui/button/button.svelte";
  import { createEventDispatcher } from "svelte";
  import ArrowUpwardIcon from "../../svg/ArrowUpwardIcon.svelte";
  import ArrowDownwardIcon from "../../svg/ArrowDownwardIcon.svelte";
  const dispatch = createEventDispatcher();

  export let key;
  export let faq;
  export let disableUp = false;
  export let disableDown = false;
  export let disabled = false;
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
  <div class="grow">
    <h3 class=" font-semibold">{faq.question}</h3>
    <p>{@html faq.answer}</p>
  </div>
  <div>
    <Button on:click={() => dispatch("edit", { key })} {disabled}>Edit</Button>
    <Button
      variant="destructive"
      on:click={() => dispatch("delete", { key })}
      {disabled}>Delete</Button
    >
  </div>
</div>
