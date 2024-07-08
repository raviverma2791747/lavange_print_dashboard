<script>
  //@ts-nocheck
  import { createEventDispatcher, onMount } from "svelte";
  import EditVariantImage from "./EditVariantImage.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Variant from "./Variant.svelte";

  const dispatch = createEventDispatcher();

  export let variantSchema = [];
  export let variants = [];
  export let disabled = false;
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
        <th scope="col" class="px-6 py-3"> Action </th>
      </tr>
    </thead>
    <tbody>
      {#each variants as variant, index}
        <Variant
          {variant}
          key={index}
          on:delete={({ detail }) => {
            variants = variants.filter((item, index) => index !== detail.key);
          }}
        />
      {/each}
    </tbody>
  </table>
</div>

<!-- {#if active_variant_index !== -1}
    <EditVariantImage bind:variants bind:active_variant_index {variantSchema} />
  {/if} -->
