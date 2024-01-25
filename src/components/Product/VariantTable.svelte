<script>
  //@ts-nocheck
  import { createEventDispatcher, onMount } from "svelte";
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
  <table
    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
  >
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" class="px-6 py-3"> Variant </th>
        <th scope="col" class="px-6 py-3"> Price </th>
        <th scope="col" class="px-6 py-3"> SKU </th>
        <th scope="col" class="px-6 py-3"> Quantity </th>
        <!-- <th scope="col" class="px-6 py-3"> Action </th> -->
      </tr>
    </thead>
    <tbody>
      {#each variants as variant}
        <tr class="bg-white border-b">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
          >
          {uniqueName(variant)}
          </th>
          <td class="px-6 py-4">
            <input
              disabled={disabled}
              bind:value={variant.price}
              on:blur={(e)=>{
                dispatch('price',{ variant, price: e.target.value })
              }}
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Price"
            />
          </td>
          <td class="px-6 py-4">
            <input
              disabled={disabled}
              bind:value={variant.sku}
              on:input={(e)=>{
                dispatch('sku',{ variant })
              }}
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="SKU"
            />
          </td>
          <td class="px-6 py-4">
            <input
              disabled={disabled}
              bind:value={variant.sku}
              on:input={(e)=>{
                dispatch('sku',{ variant })
              }}
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Quantity"
            />
          </td>
          <!-- <td class="px-6 py-4"> <a>Edit</a> </td> -->
        </tr>
      {/each}
    </tbody>
  </table>
</div>
