<script>
  //@ts-nocheck
  import { createEventDispatcher, onMount } from "svelte";
  import EditVariantImage from "./EditVariantImage.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";

  const dispatch = createEventDispatcher();

  export let variantSchema = [];
  export let variants = [];
  export let disabled = false;

  const uniqueName = (variant) => {
    const names = Object.keys(variant.attributes);
    let uname = "";
    names.forEach((name) => {
      let variant_ = variantSchema.find((variantOption) => {
        return variantOption.name === name;
      });

      let opt_ = variant_.options.find((option) => {
        return option.value === variant.attributes[name];
      });

      if (uname === "") {
        uname = opt_.displayName;
      } else {
        uname += `/${opt_.displayName}`;
      }
    });

    return uname;
  };
</script>

<div class="relative overflow-x-auto">
  <table class="w-full text-sm text-left rtl:text-right">
    <thead class="text-xs uppercase">
      <tr>
        <th scope="col" class="px-6 py-3"> Variant </th>
        <th scope="col" class="px-6 py-3"> Compare at Price </th>
        <th scope="col" class="px-6 py-3"> Price </th>
        <th scope="col" class="px-6 py-3"> SKU </th>
        <th scope="col" class="px-6 py-3"> Quantity </th>
        <!-- <th scope="col" class="px-6 py-3"> Action </th> -->
      </tr>
    </thead>
    <tbody>
      {#each variants as variant, index}
        <tr class=" border-b">
          <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
            <div>{uniqueName(variant)}</div>

            <Dialog.Root>
              <Dialog.Trigger
                {disabled}
                class="border px-2 py-1 rounded-lg h-24 w-24"
              >
                Edit Images <br />
                {variant.assets.length}
              </Dialog.Trigger>
              <Dialog.Content class="max-w-7xl">
                <EditVariantImage
                  bind:variants
                  active_variant_index={index}
                  {variantSchema}
                />
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
                variant.price = e.target.value
                  ? Number(e.target.value)
                  : variant.price;
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
          <!-- <td class="px-6 py-4"> <a>Edit</a> </td> -->
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- {#if active_variant_index !== -1}
  <EditVariantImage bind:variants bind:active_variant_index {variantSchema} />
{/if} -->
