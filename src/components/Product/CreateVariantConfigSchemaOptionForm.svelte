<script>
  //@ts-nocheck
  import CreateVariantConfigSchemaOptionValueForm from "./CreateVariantConfigSchemaOptionValueForm.svelte";
  import { createEventDispatcher } from "svelte";
  import ArrowDownwardIcon from "../svg/ArrowDownwardIcon.svelte";
  import ArrowUpwardIcon from "../svg/ArrowUpwardIcon.svelte";
  import DeleteIcon from "../svg/DeleteIcon.svelte";

  const dispatch = createEventDispatcher();

  let valid = false;

  let variantSchemaOption = {
    displayName: "",
    name: "",
    type: "other",
    options: [],
  };

  const handleCreateVariantConfigSchemaOptionValue = () => {
    variantSchemaOption.options = [
      ...variantSchemaOption.options,
      {
        displayName: "",
        value: "",
        status: "draft",
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
    if (!data.options.some((option) => option.status === "active")) {
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
    <button class="disabled:text-gray-500" disabled>
      <ArrowUpwardIcon class="w-6 h-6" />
    </button>
    <button class="disabled:text-gray-500" disabled>
      <ArrowDownwardIcon class="w-6 h-6" />
    </button>
  </div>
  <div class="grow">
    <div class="mb-4">
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900"
        >Option name</label
      >
      <div class="flex gap-1">
        <input
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          placeholder="Display name"
          bind:value={variantSchemaOption.displayName}
        />
        <input
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          placeholder="Name"
          bind:value={variantSchemaOption.name}
        />
        <select
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={variantSchemaOption.type}
          on:change={(e) => (variantSchemaOption.type = e.target.value)}
        >
          <option value="color">Color</option>
          <option value="size">Size</option>
          <option value="material">Material</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <label for="title" class="block mb-2 text-sm font-medium text-gray-900"
        >Option values</label
      >
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
        <button
          class="bg-blue-500 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          on:click={handleCreateVariantConfigSchemaOptionValue}
        >
          Add value
        </button>
      </div>
      <div class="flex gap-2">
        <button
          class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
          on:click={handleSave}
          disabled={!valid}
        >
          Done
        </button>
        <button
          class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          on:click={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  <!-- <div>
    <button
      class=" focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-500"
      on:click={handleDelete}
    >
      <DeleteIcon class="w-6 h-6" />
    </button>
  </div> -->
</div>
