<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import DataTable from "../../../components/DataTable/DataTable.svelte";
  import { format } from "date-fns";
  import { token_store } from "../../../helper/store";
  import { httpClient } from "../../../helper/httpClient";
  import {
    fetchAnnouncement,
    fetchCategory,
    fetchCollection,
    fetchHomeConfig,
    fetchProduct,
    updateHomeConfig
  } from "../../../helper/endpoints";

  let loading = true;
  let homeConfig_id;
  let edit = true;

  let homeConfig = {
    featuredCategories: [],
    featuredAnnouncements: [],
    featuredCollections: [],
    newArrivalProducts: [],
    bestSellerProducts: [],
    exploreCollections: [],
    exploreProducts: [],
  };
  let categories = [];
  let announcements = [];
  let collections = [];
  let products = [];

  const handleSave = async () => {
    await httpClient(updateHomeConfig, {
      method: "POST",
      token: $token_store,
      payload: homeConfig,
    });
  };

  const initCategories = async () => {
    const response = await httpClient(fetchCategory, {
      token: $token_store,
    });
    if (response.status === 200) {
      categories = response.data.categories;
    }
    loading = false;
  };

  const initAnnouncements = async () => {
    const response = await httpClient(fetchAnnouncement, {
      token: $token_store,
    });
    if (response.status === 200) {
      announcements = response.data.announcements;
    } else {
    }
  };

  const initCollections = async () => {
    const response = await httpClient(fetchCollection, {
      token: $token_store,
    });
    if (response.status === 200) {
      collections = response.data.collections;
    }
  };

  const initProducts = async () => {
    const response = await httpClient(fetchProduct, {
      token: $token_store,
    });

    if (response.status === 200) {
      products = response.data.products;
    }
  };

  const initHomeConfig = async () => {
    const response = await httpClient(fetchHomeConfig, {
      token: $token_store,
    });
    if (response.status === 200) {
      homeConfig = response.data.homeConfig;
    }
  };

  onMount(async () => {
    loading = true;
    homeConfig_id = $page.params._id;

    await initCategories();
    await initAnnouncements();
    await initCollections();
    await initProducts();

    if (homeConfig_id !== "create") {
      await initHomeConfig();
    } else {
      edit = true;
    }

    loading = false;
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Homepage Template</h1>
    <!-- <button
        type="button"
        class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
        on:click={() => {
          goto("/product/create");
        }}
      >
        Add Product</button
      > -->
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Info</h3>
      <div class="mb-5">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900"
          >Template name</label
        >
        <input
          disabled
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Template name"
          bind:value={homeConfig.name}
        />
      </div>
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Featured Category</h3>
      {#if loading}{:else}
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3"> Name </th>
                <th scope="col" class="px-6 py-3"> Status </th>
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
                  <td class="px-6 py-4">
                    <input
                      checked={homeConfig.featuredCategories.find(
                        (category_) => {
                          return category_ === category._id;
                        }
                      )}
                      on:change={() => {
                        let index = homeConfig.featuredCategories.findIndex(
                          (category_) => {
                            return category_ === category._id;
                          }
                        );
                        if (index > -1) {
                          homeConfig.featuredCategories = [
                            ...homeConfig.featuredCategories.slice(0, index),
                            ...homeConfig.featuredCategories.slice(index + 1),
                          ];
                        } else {
                          homeConfig.featuredCategories = [
                            ...homeConfig.featuredCategories,
                            category._id,
                          ];
                        }
                      }}
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Announcement</h3>
      {#if loading}{:else}
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3"> Name </th>
                <th scope="col" class="px-6 py-3"> Status </th>
              </tr>
            </thead>
            <tbody>
              {#each announcements as announcement}
                <tr class="odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {announcement.title}
                  </th>
                  <td class="px-6 py-4">
                    <input
                      checked={homeConfig.featuredAnnouncements.find(
                        (announcement_) => {
                          return announcement_ === announcement._id;
                        }
                      )}
                      on:change={() => {
                        let index = homeConfig.featuredAnnouncements.findIndex(
                          (announcement_) => {
                            return announcement_ === announcement._id;
                          }
                        );
                        if (index > -1) {
                          homeConfig.featuredAnnouncements = [
                            ...homeConfig.featuredAnnouncements.slice(0, index),
                            ...homeConfig.featuredAnnouncements.slice(
                              index + 1
                            ),
                          ];
                        } else {
                          homeConfig.featuredAnnouncements = [
                            ...homeConfig.featuredAnnouncements,
                            announcement._id,
                          ];
                        }
                      }}
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Explore Products</h3>
      {#if loading}{:else}
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3"> Title </th>
                <th scope="col" class="px-6 py-3"> Status </th>
              </tr>
            </thead>
            <tbody>
              {#each products as product}
                <tr class="odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {product.title}
                  </th>
                  <td class="px-6 py-4">
                    <input
                      checked={homeConfig.exploreProducts.find((product_) => {
                        return product_ === product._id;
                      })}
                      on:change={() => {
                        let index = homeConfig.exploreProducts.findIndex(
                          (product_) => {
                            return product_ === product._id;
                          }
                        );
                        if (index > -1) {
                          homeConfig.exploreProducts = [
                            ...homeConfig.exploreProducts.slice(0, index),
                            ...homeConfig.exploreProducts.slice(index + 1),
                          ];
                        } else {
                          homeConfig.exploreProducts = [
                            ...homeConfig.exploreProducts,
                            product._id,
                          ];
                        }
                      }}
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Explore Collections</h3>
      {#if loading}{:else}
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3"> Name </th>
                <th scope="col" class="px-6 py-3"> Status </th>
              </tr>
            </thead>
            <tbody>
              {#each collections as collection}
                <tr class="odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {collection.name}
                  </th>
                  <td class="px-6 py-4">
                    <input
                      checked={homeConfig.exploreCollections.find(
                        (collection_) => {
                          return collection_ === collection._id;
                        }
                      )}
                      on:change={() => {
                        let index = homeConfig.exploreCollections.findIndex(
                          (collection_) => {
                            return collection_ === collection._id;
                          }
                        );
                        if (index > -1) {
                          homeConfig.exploreCollections = [
                            ...homeConfig.exploreCollections.slice(0, index),
                            ...homeConfig.exploreCollections.slice(index + 1),
                          ];
                        } else {
                          homeConfig.exploreCollections = [
                            ...homeConfig.exploreCollections,
                            collection._id,
                          ];
                        }
                      }}
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Best Seller Products</h3>
      {#if loading}{:else}
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3"> Title </th>
                <th scope="col" class="px-6 py-3"> Status </th>
              </tr>
            </thead>
            <tbody>
              {#each products as product}
                <tr class="odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {product.title}
                  </th>
                  <td class="px-6 py-4">
                    <input
                      checked={homeConfig.bestSellerProducts.find(
                        (product_) => {
                          return product_ === product._id;
                        }
                      )}
                      on:change={() => {
                        let index = homeConfig.bestSellerProducts.findIndex(
                          (product_) => {
                            return product_ === product._id;
                          }
                        );
                        if (index > -1) {
                          homeConfig.bestSellerProducts = [
                            ...homeConfig.bestSellerProducts.slice(0, index),
                            ...homeConfig.bestSellerProducts.slice(index + 1),
                          ];
                        } else {
                          homeConfig.bestSellerProducts = [
                            ...homeConfig.bestSellerProducts,
                            product._id,
                          ];
                        }
                      }}
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">New Arrivals</h3>
      {#if loading}{:else}
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3"> Title </th>
                <th scope="col" class="px-6 py-3"> Status </th>
              </tr>
            </thead>
            <tbody>
              {#each products as product}
                <tr class="odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {product.title}
                  </th>
                  <td class="px-6 py-4">
                    <input
                      checked={homeConfig.newArrivalProducts.find(
                        (product_) => {
                          return product_ === product._id;
                        }
                      )}
                      on:change={() => {
                        let index = homeConfig.newArrivalProducts.findIndex(
                          (product_) => {
                            return product_ === product._id;
                          }
                        );
                        if (index > -1) {
                          homeConfig.newArrivalProducts = [
                            ...homeConfig.newArrivalProducts.slice(0, index),
                            ...homeConfig.newArrivalProducts.slice(index + 1),
                          ];
                        } else {
                          homeConfig.newArrivalProducts = [
                            ...homeConfig.newArrivalProducts,
                            product._id,
                          ];
                        }
                      }}
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Featured Collections</h3>
      {#if loading}{:else}
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3"> Name </th>
                <th scope="col" class="px-6 py-3"> Status </th>
              </tr>
            </thead>
            <tbody>
              {#each collections as collection}
                <tr class="odd:bg-white even:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {collection.name}
                  </th>
                  <td class="px-6 py-4">
                    <input
                      checked={homeConfig.featuredCollections.find(
                        (collection_) => {
                          return collection_ === collection._id;
                        }
                      )}
                      on:change={() => {
                        let index = homeConfig.featuredCollections.findIndex(
                          (collection_) => {
                            return collection_ === collection._id;
                          }
                        );
                        if (index > -1) {
                          homeConfig.featuredCollections = [
                            ...homeConfig.featuredCollections.slice(0, index),
                            ...homeConfig.featuredCollections.slice(index + 1),
                          ];
                        } else {
                          homeConfig.featuredCollections = [
                            ...homeConfig.featuredCollections,
                            collection._id,
                          ];
                        }
                      }}
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Explore categories</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"></div>
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Explore designs</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"></div>
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h3 class="text-normal font-semibold mb-2">Featured Collections</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"></div>
    </div>
  </div>

  <button
    type="button"
    class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
    on:click={handleSave}
  >
    Save</button
  >
</div>
