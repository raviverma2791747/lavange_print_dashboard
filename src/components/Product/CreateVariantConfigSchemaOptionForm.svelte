<script>
  //@ts-nocheck
  import CreateVariantConfigSchemaOptionValueForm from "./CreateVariantConfigSchemaOptionValueForm.svelte";
  import { createEventDispatcher } from "svelte";
  import ArrowDownwardIcon from "../svg/ArrowDownwardIcon.svelte";
  import ArrowUpwardIcon from "../svg/ArrowUpwardIcon.svelte";
  import DeleteIcon from "../svg/DeleteIcon.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Select from "$lib/components/ui/select";
  import { FACET_TYPE, STATUS } from "../../helper/constants";
  import { getByValue } from "../../helper/utils";

  const dispatch = createEventDispatcher();

  let valid = false;

  let variantSchemaOption = {
    displayName: "",
    name: "",
    type: FACET_TYPE.OTHER,
    options: [],
  };

  const handleCreateVariantConfigSchemaOptionValue = () => {
    variantSchemaOption.options = [
      ...variantSchemaOption.options,
      {
        displayName: "",
        value: "",
        status: STATUS.DRAFT,
      },
    ];
  };

  const handleCreateVariantConfigSchemaOptionValueMoveUp = (e) => {
    if (e.detail.index === 1) {
      variantSchemaOption.options = [
        variantSchemaOption.options[e.detail.index],
        ...variantSchemaOption.options.slice(0, e.detail.index),
        ...variantSchemaOption.options.slice(e.detail.index + 1),
      ];
    } else {
      variantSchemaOption.options = [
        ...variantSchemaOption.options.slice(0, e.detail.index - 1),
        variantSchemaOption.options[e.detail.index],
        variantSchemaOption.options[e.detail.index - 1],
        ...variantSchemaOption.options.slice(e.detail.index + 1),
      ];
    }
  };

  const handleCreateVariantConfigSchemaOptionValueMoveDown = (e) => {
    variantSchemaOption.options = [
      ...variantSchemaOption.options.slice(0, e.detail.index),
      variantSchemaOption.options[e.detail.index + 1],
      variantSchemaOption.options[e.detail.index],
      ...variantSchemaOption.options.slice(e.detail.index + 2),
    ];
  };

  const handleCreateVariantConfigSchemaOptionValueDelete = (e) => {
    variantSchemaOption.options = [
      ...variantSchemaOption.options.slice(0, e.detail.index),
      ...variantSchemaOption.options.slice(e.detail.index + 1),
    ];
  };

  const validate = (data) => {
    if (!data.displayName) {
      console.log("no display name");
      return false;
    }

    if (!data.name) {
      console.log("no name");
      return false;
    }

    if (!data.type) {
      console.log("no type");
      return false;
    }

    if (!data.options) {
      console.log("no options");
      return false;
    }

    if (!data.options.length) {
      console.log("no options length");
      return false;
    }

    if (data.options.some((option) => !option.displayName)) {
      console.log("no display name in options");
      return false;
    }

    if (data.options.some((option) => !option.value)) {
      console.log("no name in options");
      return false;
    }

    if (data.options.some((option) => !option.status)) {
      console.log("no status in options");
      return false;
    }

    //check if atleast one option is active in options
    if (!data.options.some((option) => option.status === STATUS.ACTIVE)) {
      console.log("no active option in options");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    dispatch("save", { variantSchemaOption });
  };

  const handleCancel = () => {
    dispatch("cancel");
  };

  $: {
    valid = validate(variantSchemaOption);
  }
</script>

<div class="flex gap-2 py-3 grow px-6">
  <div class="flex items-start">
    <Button variant="ghost" disabled>
      <ArrowUpwardIcon class="w-6 h-6" />
    </Button>
    <Button variant="ghost" disabled>
      <ArrowDownwardIcon class="w-6 h-6" />
    </Button>
  </div>
  <div class="grow">
    <div class="mb-4">
      <Label for="title">Option name</Label>
      <div class="flex gap-1">
        <Input
          type="text"
          placeholder="Display name"
          bind:value={variantSchemaOption.displayName}
        />
        <Input
          type="text"
          placeholder="Name"
          bind:value={variantSchemaOption.name}
        />

        <Select.Root
          selected={{
            value: variantSchemaOption.type,
            label: getByValue(FACET_TYPE, variantSchemaOption.type),
          }}
          onSelectedChange={(v) => {
            v && (variantSchemaOption.type = v.value);
          }}
        >
          <Select.Trigger>
            <Select.Value class="capitalize" placeholder="Status" />
          </Select.Trigger>
          <Select.Content>
            {#each Object.entries(FACET_TYPE) as [key, value]}
              <Select.Item {value} label={key} />
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <Label for="title">Option values</Label>
      <div class="flex flex-col gap-2">
        {#each variantSchemaOption.options as option, index}
          <CreateVariantConfigSchemaOptionValueForm
            disabledMoveUp={index === 0}
            disabledMoveDown={index === variantSchemaOption.options.length - 1}
            on:moveUp={handleCreateVariantConfigSchemaOptionValueMoveUp}
            on:moveDown={handleCreateVariantConfigSchemaOptionValueMoveDown}
            on:delete={handleCreateVariantConfigSchemaOptionValueDelete}
            bind:option
            {index}
            type={variantSchemaOption.type}
          />
        {/each}
        <Button on:click={handleCreateVariantConfigSchemaOptionValue}>
          Add value
        </Button>
      </div>
      <div class="flex gap-2">
        <Button on:click={handleSave} disabled={!valid}>Done</Button>
        <Button variant="outline" on:click={handleCancel}>Cancel</Button>
      </div>
    </div>
  </div>
</div>
