<script>
  //@ts-nocheck
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { createEventDispatcher } from "svelte";
  import Editor from "../../Editor.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  const dispatch = createEventDispatcher();

  export let key;
  let edit = true;
  let faq = {
    question: "",
    answer: [],
  };
</script>

<div class="border rounded-lg p-4">
  <div class="mb-5">
    <Label for="question">Question</Label>
    <Input
      id="Question"
      type="text"
      placeholder="Question"
      bind:value={faq.question}
      disabled={!edit}
    />
  </div>

  <div class="mb-5">
    <Label for="answer">Answer</Label>
    <Editor disabled={!edit} bind:content={faq.answer} placeholder="Answer" />
  </div>

  <Button
    on:click={() => {
      dispatch("save", { faq });
    }}>Done</Button
  >
  <Button variant="outline" on:click={() => dispatch("cancel", { key })}>Cancel</Button>
</div>
