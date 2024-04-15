<script>
  //@ts-nocheck
  import Input from "$lib/components/ui/input/input.svelte";
  import { createEventDispatcher } from "svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { X } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let tags = [];
  export let search_input = "";

  const handleAddTag = async (e) => {
    if (e.key === "Enter" && search_input.length > 0) {
      tags = [...tags, search_input];
      search_input = "";
    }
  };
</script>

<div class="border rounded-lg p-2 flex gap-4 flex-wrap items-center">
  <slot name="tags">
    {#each tags as tag}
      <slot name="tag" {tag}>
        <Badge class="text-base" variant="primary">
          {tag}
          <Button
            size="icon"
            variant="ghost"
            on:click={() => (tags = tags.filter((t) => t !== tag))}
          >
            <X class="w-4 h-4" />
          </Button>
        </Badge>
      </slot>
    {/each}
  </slot>
  <div class="grow">
    <slot name="input" {search_input}>
      <Input
        class="border-0"
        placeholder="Enter"
        bind:value={search_input}
        on:keydown={handleAddTag}
        type="text"
      />
    </slot>
  </div>
</div>
