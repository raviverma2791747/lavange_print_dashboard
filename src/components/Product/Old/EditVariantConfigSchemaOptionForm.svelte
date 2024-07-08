<script>
  //@ts-nocheck
  import EditVariantConfigSchemaOptionValueForm from "./EditVariantConfigSchemaOptionValueForm.svelte";
  import { createEventDispatcher } from "svelte";
  import ArrowDownwardIcon from "../svg/ArrowDownwardIcon.svelte";
  import ArrowUpwardIcon from "../svg/ArrowUpwardIcon.svelte";
  import DeleteIcon from "../svg/DeleteIcon.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Select from "$lib/components/ui/select";
  import { getByValue } from "../../helper/utils";
  import { FACET_TYPE, STATUS } from "../../helper/constants";

  const dispatch = createEventDispatcher();

  let valid = false;

  export let variantSchemaOption;
  let variantSchemaOptionClone = structuredClone(variantSchemaOption);

  const handleEditVariantConfigSchemaOptionValue = () => {
    variantSchemaOptionClone.options = [
      ...variantSchemaOptionClone.options,
      {
        displayName: "",
        value: "",
        status: STATUS.DRAFT,
      },
    ];
  };

  const handleEditVariantConfigSchemaOptionValueMoveUp = (e) => {
    if (e.detail.index === 1) {
      variantSchemaOptionClone.options = [
        variantSchemaOptionClone.options[e.detail.index],
        ...variantSchemaOptionClone.options.slice(0, e.detail.index),
        ...variantSchemaOptionClone.options.slice(e.detail.index + 1),
      ];
    } else {
      variantSchemaOptionClone.options = [
        ...variantSchemaOptionClone.options.slice(0, e.detail.index - 1),
        variantSchemaOptionClone.options[e.detail.index],
        variantSchemaOptionClone.options[e.detail.index - 1],
        ...variantSchemaOptionClone.options.slice(e.detail.index + 1),
      ];
    }
  };

  const handleEditVariantConfigSchemaOptionValueMoveDown = (e) => {
    variantSchemaOptionClone.options = [
      ...variantSchemaOptionClone.options.slice(0, e.detail.index),
      variantSchemaOptionClone.options[e.detail.index + 1],
      variantSchemaOptionClone.options[e.detail.index],
      ...variantSchemaOptionClone.options.slice(e.detail.index + 2),
    ];
  };

  const handleEditVariantConfigSchemaOptionValueDelete = (e) => {
    variantSchemaOptionClone.options = [
      ...variantSchemaOptionClone.options.slice(0, e.detail.index),
      ...variantSchemaOptionClone.options.slice(e.detail.index + 1),
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

    if (!data.type && data.type !== 0) {
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
    variantSchemaOption = variantSchemaOptionClone;
    dispatch("save", { variantSchemaOption: variantSchemaOptionClone });
  };

  const handleCancel = () => {
    dispatch("cancel");
  };

  $: {
    valid = validate(variantSchemaOptionClone);
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
          bind:value={variantSchemaOptionClone.displayName}
        />
        <Input
          type="text"
          placeholder="Name"
          bind:value={variantSchemaOptionClone.name}
        />
        <Select.Root
          selected={{
            value: variantSchemaOptionClone.type,
            label: getByValue(FACET_TYPE, variantSchemaOptionClone.type),
          }}
          onSelectedChange={(v) => {
            v && (variantSchemaOptionClone.type = v.value);
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
        {#each variantSchemaOptionClone.options as option, index}
          <EditVariantConfigSchemaOptionValueForm
            disabledMoveUp={index === 0}
            disabledMoveDown={index ===
              variantSchemaOptionClone.options.length - 1}
            on:moveUp={handleEditVariantConfigSchemaOptionValueMoveUp}
            on:moveDown={handleEditVariantConfigSchemaOptionValueMoveDown}
            on:delete={handleEditVariantConfigSchemaOptionValueDelete}
            bind:option
            {index}
            type={variantSchemaOptionClone.type}
          />
        {/each}
        <Button on:click={handleEditVariantConfigSchemaOptionValue}>
          Add value
        </Button>
      </div>
      <div class="flex gap-2">
        <Button on:click={handleSave} disabled={!valid}>Done</Button>
        <Button variant="outline" on:click={handleCancel}>Cancel</Button>
      </div>
    </div>
  </div>
  <!-- <div>
      <Button
        class=" focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-500"
        on:click={handleDelete}
      >
        <DeleteIcon class="w-6 h-6" />
      </Button>
    </div> -->
</div>
