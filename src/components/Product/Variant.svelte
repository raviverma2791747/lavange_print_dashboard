<script>
  //@ts-nocheck
  import { createEventDispatcher, onMount } from "svelte";
  import EditVariantImage from "./EditVariantImage.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import EditVariantForm from "./EditVariantForm.svelte";

  const dispatch = createEventDispatcher();
  export let key;
  export let variant;
  export let disabled = false;

  const uniqueName = (variant) => {
    const variantAttributes = Object.entries(variant.attributes);
    let uname = "";
    variantAttributes.forEach(([variantAttributeKey, variantAttribute]) => {
      if (uname === "") {
        uname = variantAttribute.name;
      } else {
        uname += `/${variantAttribute.name}`;
      }
    });

    return uname;
  };
</script>

<tr class=" border-b">
  <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
    <div>{uniqueName(variant)}</div>

    <Dialog.Root>
      <Dialog.Trigger {disabled} class="border px-2 py-1 rounded-lg h-24 w-24">
        Edit Images <br />
        {variant.assets.length}
      </Dialog.Trigger>
      <Dialog.Content class="max-w-7xl">
        <!-- <EditVariantImage
          bind:variants
          active_variant_index={key}
          {variantSchema}
        /> -->
      </Dialog.Content>
    </Dialog.Root>
  </th>
  <td class="px-6 py-4">
    <Input
      {disabled}
      value={variant.compareAtPrice}
      on:blur={(e) => {
        dispatch("compareAtPrice", {
          variant,
          compareAtPrice: e.target.value,
        });
      }}
      type="number"
      placeholder="Compare At Price"
      on:input={(e) => {
        variant.compareAtPrice = e.target.value
          ? Number(e.target.value)
          : variant.compareAtPrice;
      }}
    />
  </td>
  <td class="px-6 py-4">
    <Input
      {disabled}
      value={variant.price}
      on:blur={(e) => {
        dispatch("price", { variant, price: e.target.value });
      }}
      type="number"
      on:input={(e) => {
        variant.price = e.target.value ? Number(e.target.value) : variant.price;
      }}
      placeholder="Price"
    />
  </td>
  <td class="px-6 py-4">
    <Input
      {disabled}
      bind:value={variant.sku}
      on:input={(e) => {
        dispatch("sku", { variant });
      }}
      type="text"
      placeholder="SKU"
    />
  </td>
  <td class="px-6 py-4">
    <Input
      {disabled}
      bind:value={variant.sku}
      on:input={(e) => {
        dispatch("sku", { variant });
      }}
      type="number"
      placeholder="Quantity"
    />
  </td>
  <td>
    <div class="flex flex-col gap-2">
      <Dialog.Root class="w-full">
        <Dialog.Trigger {disabled} class="w-full">
          <Button>Edit</Button>
        </Dialog.Trigger>
        <Dialog.Content class="max-w-7xl">
          <EditVariantForm />
        </Dialog.Content>
      </Dialog.Root>
      <Button
        variant="destructive"
        on:click={() => dispatch("delete", { key })}>Delete</Button
      >
    </div>
  </td>
  <!-- <td class="px-6 py-4"> <a>Edit</a> </td> -->
</tr>
