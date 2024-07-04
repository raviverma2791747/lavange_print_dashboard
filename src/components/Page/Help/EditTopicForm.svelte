<script>
  //@ts-nocheck
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import CreateFaqForm from "./CreateFaqForm.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { createEventDispatcher } from "svelte";
  import Faq from "./Faq.svelte";
  import EditFaqForm from "./EditFaqForm.svelte";

  const dispatch = createEventDispatcher();

  let edit = true;
  let create = false;
  export let topic = {
    title: "",
    faqs: [],
  };
  let edit_faq_index = -1;
</script>

<div class="border p-4 rounded-lg">
  <h3 class="text-normal font-semibold mb-2">Add Topic</h3>
  <div class="mb-5">
    <Label for="title">Title</Label>
    <Input
      id="Title"
      type="text"
      placeholder="Title"
      bind:value={topic.title}
      disabled={!edit}
    />
  </div>

  <div class="flex flex-col space-y-4 mb-4">
    {#each topic.faqs as faq, i}
      {#if edit_faq_index === i}
        <EditFaqForm
          key={i}
          {faq}
          on:save={({ detail }) => {
            topic.faqs[edit_faq_index] = detail.faq;
            edit_faq_index = -1;
          }}
          on:cancel={() => (edit_faq_index = -1)}
        />
      {:else}
        <Faq
          key={i}
          {faq}
          disabled={edit_faq_index > -1}
          disableUp={i === 0}
          disableDown={i === topic.faqs.length - 1}
          on:edit={({ detail }) => {
            edit_faq_index = detail.key;
          }}
          on:delete={({ detail }) => {
            topic.faqs = topic.faqs.filter((_, index) => index !== detail.key);
          }}
          on:up={({ detail }) => {
            const temp = topic.faqs[detail.key - 1];
            topic.faqs[detail.key - 1] = topic.faqs[detail.key];
            topic.faqs[detail.key] = temp;
          }}
          on:down={({ detail }) => {
            const temp = topic.faqs[detail.key + 1];
            topic.faqs[detail.key + 1] = topic.faqs[detail.key];
            topic.faqs[detail.key] = temp;
          }}
        />
      {/if}
    {/each}
  </div>

  <div class="mb-4">
    {#if create}
      <CreateFaqForm
        on:save={({ detail }) => {
          topic.faqs = [...topic.faqs, detail.faq];
          create = false;
        }}
        on:cancel={() => {
          create = false;
        }}
      />
    {:else}
      <Button
        variant="link"
        on:click={() => {
          create = true;
        }}>Add FAQ</Button
      >
    {/if}
  </div>

  <Button
    on:click={() => {
      dispatch("save", { topic });
    }}>Done</Button
  >

  <Button variant="outline" on:click={() => dispatch("cancel")}>Cancel</Button>
</div>
