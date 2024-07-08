<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";
  import ArrowDownwardIcon from "../svg/ArrowDownwardIcon.svelte";
  import ArrowUpwardIcon from "../svg/ArrowUpwardIcon.svelte";
  import DeleteIcon from "../svg/DeleteIcon.svelte";
  import * as Select from "$lib/components/ui/select";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { getByValue } from "../../helper/utils";
  import { FACET_TYPE, STATUS } from "../../helper/constants";

  const dispatch = createEventDispatcher();

  export let option;
  export let type;
  export let index;
  export let disabledMoveDown;
  export let disabledMoveUp;

  const handleMoveUp = () => {
    dispatch("moveUp", { index });
  };

  const handleMoveDown = () => {
    dispatch("moveDown", { index });
  };

  const handleDelete = () => {
    dispatch("delete", { index });
  };
</script>

<div class="flex gap-2 items-center">
  <div class="flex">
    <Button variant="ghost" disabled={disabledMoveUp} on:click={handleMoveUp}>
      <ArrowUpwardIcon class="w-6 h-6" />
    </Button>
    <Button variant="ghost" disabled={disabledMoveDown} on:click={handleMoveDown}>
      <ArrowDownwardIcon class="w-6 h-6" />
    </Button>
  </div>
  <Input
    type="text"
    id="title"
    placeholder="Display name"
    bind:value={option.displayName}
  />
  {#if type === FACET_TYPE.COLOR}
    <Input class="w-36 p-0" type="color" bind:value={option.value} />
  {:else}
    <Input type="text" placeholder="Value" bind:value={option.value} />
  {/if}

  <Select.Root
    selected={{
      value: option.status,
      label: getByValue(STATUS, option.status),
    }}
    onSelectedChange={(v) => {
      v && (option.status = v.value);
    }}
  >
    <Select.Trigger>
      <Select.Value class="capitalize" placeholder="Status" />
    </Select.Trigger>
    <Select.Content>
      {#each Object.entries(STATUS) as [key, value]}
        <Select.Item {value} label={key} />
      {/each}
    </Select.Content>
  </Select.Root>

  <Button variant="destructive" on:click={handleDelete}>
    <DeleteIcon class="w-6 h-6" />
  </Button>
</div>
