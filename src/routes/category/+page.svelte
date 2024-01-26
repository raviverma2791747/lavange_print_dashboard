<script>
    //@ts-nocheck
    import { goto } from "$app/navigation";
    import { v4 as uuidv4 } from "uuid";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Loading from "../../components/Loading.svelte";
  import { httpClient } from "../../helper/httpClient";
  import { token_store } from "../../helper/store";
  import { fetchCategory } from "../../helper/endpoints";
  import { formatDate } from "../../helper/utils";
  import { DATE_TIME_FORMAT } from "../../helper/constants";
  
    let categories = [];
    let loading = true;

    const initCategories = async () => {
      loading = true;
      const response = await httpClient(fetchCategory,{
        token: $token_store
      })
      if (response.status === 200) {
        categories = response.data.categories;
      }
      loading = false;
    }
  
    onMount(async () => {
      await initCategories();
    });
  </script>
  
  <div class="py-4 px-8 max-w-7xl mx-auto">
    <div class="mb-2 flex justify-between">
      <h1 class="text-2xl font-bold">Categories</h1>
      <button
        type="button"
        class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
        on:click={() => {
          goto("/category/create");
        }}
      >
        Add Category</button
      >
    </div>
    <div class="flex flex-col gap-4">
      <div
        class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
      >
        {#if loading}
          <Loading />
        {:else if categories.length}
          <div class="relative overflow-x-auto sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3"> Title </th>
                  <!-- <th scope="col" class="px-6 py-3"> Status </th> -->
                  <th scope="col" class="px-6 py-3"> Action </th>
                  <th scope="col" class="px-6 py-3"> Modified </th>
                </tr>
              </thead>
              <tbody>
                {#each categories as category}
                  <tr class="odd:bg-white even:bg-gray-50">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {category.name}
                    </th>
                    <!-- <td class="px-6 py-4">
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                        >{category.status}</span
                      >
                    </td> -->
                    <td class="px-6 py-4">
                      <a
                        href={`/category/${category._id}`}
                        class="font-medium text-blue-600 hover:underline">View</a
                      >
                    </td>
                    <td class="px-6 py-4">
                      {formatDate(category.updatedAt, DATE_TIME_FORMAT)}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <div class="flex justify-center">
            <div>
              <div>No categories to show!</div>
              <!-- <button
              type="button"
              class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
              on:click={() => {
                goto("/product/create");
              }}
            >
              Add Product</button
            > -->
              <div></div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  