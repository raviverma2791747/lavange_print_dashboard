<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { format } from "date-fns";
  import { httpClient } from "../../../helper/httpClient";
  import {
    fetchAnnouncement,
    fetchCategory,
    fetchCollection,
    fetchHomeConfig,
    fetchProduct,
    updateHomeConfig,
    getCategory,
    getCollection,
    getAnnouncement,
    getProduct,
  } from "../../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Spinner from "../../../components/Spinner.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import TagInput from "../../../components/TagInput.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import { X } from "lucide-svelte";
  import {
    user_cache,
    product_cache,
    category_cache,
    collection_cache,
    announcement_cache,
  } from "../../../helper/cache_store";
  import Autocomplete from "../../../components/Autocomplete.svelte";
  import * as HoverCard from "$lib/components/ui/hover-card";
  import { toastMessage } from "../../../helper/utils";

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

  let suggested_categories = [];
  let suggested_collections = [];
  let suggested_products = [];
  let suggested_announcements = [];

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateHomeConfig, {
      method: "POST",
      payload: homeConfig,
    });

    if (response.status === 200) {
      toastMessage(
        `Home page ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
    }

    loading = false;
  };

  const initHomeConfig = async () => {
    const response = await httpClient(fetchHomeConfig);
    if (response.status === 200) {
      homeConfig = response.data.homeConfig;
    }
  };

  const fetchCategories = async (search) => {
    if (search) {
      const response = await httpClient(fetchCategory, {
        queryParams: { search },
      });

      if (response.status === 200) {
        suggested_categories = response.data.categories ?? [];
      } else {
        suggested_categories = [];
      }

      suggested_categories.forEach((category) => {
        if (!$category_cache.has(category._id)) {
          $category_cache.set(category._id, category);
        }
      });
    }
  };

  const fetchAnnouncements = async (search) => {
    if (search) {
      const response = await httpClient(fetchAnnouncement, {
        params: { search },
      });
      if (response.status === 200) {
        suggested_announcements = response.data.announcements ?? [];
      } else {
        suggested_announcements = [];
      }

      suggested_announcements.forEach((announcement) => {
        if (!$announcement_cache.has(announcement._id)) {
          $announcement_cache.set(announcement._id, announcement);
        }
      });
    }
  };

  const fetchCollections = async (search) => {
    if (search) {
      const response = await httpClient(fetchCollection, {
        params: { search },
      });
      if (response.status === 200) {
        suggested_collections = response.data.collections ?? [];
      } else {
        suggested_collections = [];
      }

      suggested_collections.forEach((collection) => {
        if (!$collection_cache.has(collection._id)) {
          $collection_cache.set(collection._id, collection);
        }
      });
    }
  };

  const fetchProducts = async (search) => {
    if (search) {
      const response = await httpClient(fetchProduct, {
        params: { search },
      });
      if (response.status === 200) {
        suggested_products = response.data.products ?? [];
      } else {
        suggested_products = [];
      }

      suggested_products.forEach((product) => {
        if (!$product_cache.has(product._id)) {
          $product_cache.set(product._id, product);
        }
      });
    }
  };

  const getCategoryById = async (id) => {
    if ($category_cache.has(id)) {
      return $category_cache.get(id);
    } else {
      const response = await httpClient(`${getCategory}/${id}`);
      if (response.status === 200) {
        let category = response.data.category ?? null;

        if (category) {
          $category_cache.set(category._id, category);
        }
        return category;
      }
      return null;
    }
  };

  const getAnnouncementById = async (id) => {
    if ($announcement_cache.has(id)) {
      return $announcement_cache.get(id);
    } else {
      const response = await httpClient(`${getAnnouncement}/${id}`, {});
      if (response.status === 200) {
        let announcement = response.data.announcement ?? null;

        if (announcement) {
          $announcement_cache.set(announcement._id, announcement);
        }
        return announcement;
      }
      return null;
    }
  };

  const getCollectionById = async (id) => {
    if ($collection_cache.has(id)) {
      return $collection_cache.get(id);
    } else {
      const response = await httpClient(`${getCollection}/${id}`, {});
      if (response.status === 200) {
        let collection = response.data.collection ?? null;

        if (collection) {
          $collection_cache.set(collection._id, collection);
        }

        return collection;
      }
      return null;
    }
  };

  const getProductById = async (id) => {
    if ($product_cache.has(id)) {
      return $product_cache.get(id);
    } else {
      const response = await httpClient(`${getProduct}/${id}`, {});
      if (response.status === 200) {
        let product = response.data.product ?? null;
        if (product) {
          $product_cache.set(product._id, product);
        }
        return product;
      }
      return null;
    }
  };

  onMount(async () => {
    loading = true;
    homeConfig_id = $page.params._id;

    if (homeConfig_id !== "create") {
      await initHomeConfig();
      await Promise.all(
        homeConfig.featuredCategories.map((category) =>
          getCategoryById(category)
        )
      );

      await Promise.all(
        homeConfig.featuredAnnouncements.map((announcement) =>
          getAnnouncementById(announcement)
        )
      );

      await Promise.all(
        homeConfig.exploreCollections.map((collection) =>
          getCollectionById(collection)
        )
      );

      await Promise.all(
        homeConfig.exploreProducts.map((product) => getProductById(product))
      );
    } else {
      edit = true;
    }

    loading = false;
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Home Page</h1>
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Info</h3>
          <div class="mb-5">
            <Label for="title">Page name</Label>
            <Input
              disabled
              type="text"
              placeholder="Template name"
              bind:value={homeConfig.name}
            />
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Featured Category</h3>
          <TagInput tags={homeConfig.featuredCategories}>
            <svelte:fragment slot="tag" let:tag>
              <Badge class="text-base" variant="primary">
                {$category_cache.get(tag)?.name ?? tag}
                <Button
                  size="icon"
                  variant="ghost"
                  on:click={() => {
                    homeConfig.featuredCategories =
                      homeConfig.featuredCategories.filter((t) => t !== tag);
                  }}
                >
                  <X class="w-4 h-4" />
                </Button>
              </Badge>
            </svelte:fragment>
            <svelte:fragment slot="input" let:search_input>
              <Autocomplete
                class="border-0"
                placeholder="Search Category"
                search={search_input}
                on:input={async (e) => {
                  await fetchCategories(e.detail.target.value);
                }}
                items={suggested_categories}
                on:selected={(e) => {
                  if (
                    homeConfig.featuredCategories.includes(e.detail.item._id)
                  ) {
                    return;
                  }
                  homeConfig.featuredCategories = [
                    ...homeConfig.featuredCategories,
                    e.detail.item._id,
                  ];
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>
            </svelte:fragment>
          </TagInput>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Announcement</h3>
          <TagInput tags={homeConfig.featuredAnnouncements}>
            <svelte:fragment slot="tag" let:tag>
              <Badge class="text-base" variant="primary">
                {$announcement_cache.get(tag)?.title ?? tag}
                <Button
                  size="icon"
                  variant="ghost"
                  on:click={() => {
                    homeConfig.featuredAnnouncements =
                      homeConfig.featuredAnnouncements.filter((t) => t !== tag);
                  }}
                >
                  <X class="w-4 h-4" />
                </Button>
              </Badge>
            </svelte:fragment>
            <svelte:fragment slot="input" let:search_input>
              <Autocomplete
                class="border-0"
                placeholder="Search Announcement"
                search={search_input}
                on:input={async (e) => {
                  await fetchAnnouncements(e.detail.target.value);
                }}
                items={suggested_announcements}
                on:selected={(e) => {
                  if (
                    homeConfig.featuredAnnouncements.includes(e.detail.item._id)
                  ) {
                    return;
                  }
                  homeConfig.featuredAnnouncements = [
                    ...homeConfig.featuredAnnouncements,
                    e.detail.item._id,
                  ];
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.title}</svelte:fragment
                >
              </Autocomplete>
            </svelte:fragment>
          </TagInput>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Explore Products</h3>
          <TagInput tags={homeConfig.exploreProducts}>
            <svelte:fragment slot="tag" let:tag>
              <Badge class="text-base" variant="primary">
                {$product_cache.get(tag)?.title ?? tag}
                <Button
                  size="icon"
                  variant="ghost"
                  on:click={() => {
                    homeConfig.exploreProducts =
                      homeConfig.exploreProducts.filter((t) => t !== tag);
                  }}
                >
                  <X class="w-4 h-4" />
                </Button>
              </Badge>
            </svelte:fragment>
            <svelte:fragment slot="input" let:search_input>
              <Autocomplete
                class="border-0"
                placeholder="Search Product"
                search={search_input}
                on:input={async (e) => {
                  await fetchProducts(e.detail.target.value);
                }}
                items={suggested_products}
                on:selected={(e) => {
                  if (homeConfig.exploreProducts.includes(e.detail.item._id)) {
                    return;
                  }
                  homeConfig.exploreProducts = [
                    ...homeConfig.exploreProducts,
                    e.detail.item._id,
                  ];
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.title}</svelte:fragment
                >
              </Autocomplete>
            </svelte:fragment>
          </TagInput>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Explore Collections</h3>
          <TagInput tags={homeConfig.exploreCollections}>
            <svelte:fragment slot="tag" let:tag>
              <Badge class="text-base" variant="primary">
                {$collection_cache.get(tag)?.name ?? tag}
                <Button
                  size="icon"
                  variant="ghost"
                  on:click={() => {
                    homeConfig.exploreCollections =
                      homeConfig.exploreCollections.filter((t) => t !== tag);
                  }}
                >
                  <X class="w-4 h-4" />
                </Button>
              </Badge>
            </svelte:fragment>
            <svelte:fragment slot="input" let:search_input>
              <Autocomplete
                class="border-0"
                placeholder="Search Collection"
                search={search_input}
                on:input={async (e) => {
                  await fetchCollections(e.detail.target.value);
                }}
                items={suggested_collections}
                on:selected={(e) => {
                  if (
                    homeConfig.exploreCollections.includes(e.detail.item._id)
                  ) {
                    return;
                  }
                  homeConfig.exploreCollections = [
                    ...homeConfig.exploreCollections,
                    e.detail.item._id,
                  ];
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>
            </svelte:fragment>
          </TagInput>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Best Seller Products</h3>
          <TagInput tags={homeConfig.bestSellerProducts}>
            <svelte:fragment slot="tag" let:tag>
              <Badge class="text-base" variant="primary">
                {$product_cache.get(tag)?.title ?? tag}
                <Button
                  size="icon"
                  variant="ghost"
                  on:click={() => {
                    homeConfig.bestSellerProducts =
                      homeConfig.bestSellerProducts.filter((t) => t !== tag);
                  }}
                >
                  <X class="w-4 h-4" />
                </Button>
              </Badge>
            </svelte:fragment>
            <svelte:fragment slot="input" let:search_input>
              <Autocomplete
                class="border-0"
                placeholder="Search Product"
                search={search_input}
                on:input={async (e) => {
                  await fetchProducts(e.detail.target.value);
                }}
                items={suggested_products}
                on:selected={(e) => {
                  if (
                    homeConfig.bestSellerProducts.includes(e.detail.item._id)
                  ) {
                    return;
                  }
                  homeConfig.bestSellerProducts = [
                    ...homeConfig.bestSellerProducts,
                    e.detail.item._id,
                  ];
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.title}</svelte:fragment
                >
              </Autocomplete>
            </svelte:fragment>
          </TagInput>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">New Arrival Products</h3>
          <TagInput tags={homeConfig.newArrivalProducts}>
            <svelte:fragment slot="tag" let:tag>
              <Badge class="text-base" variant="primary">
                {$product_cache.get(tag)?.title ?? tag}
                <Button
                  size="icon"
                  variant="ghost"
                  on:click={() => {
                    homeConfig.newArrivalProducts =
                      homeConfig.newArrivalProducts.filter((t) => t !== tag);
                  }}
                >
                  <X class="w-4 h-4" />
                </Button>
              </Badge>
            </svelte:fragment>
            <svelte:fragment slot="input" let:search_input>
              <Autocomplete
                class="border-0"
                placeholder="Search Product"
                search={search_input}
                on:input={async (e) => {
                  await fetchProducts(e.detail.target.value);
                }}
                items={suggested_products}
                on:selected={(e) => {
                  if (
                    homeConfig.newArrivalProducts.includes(e.detail.item._id)
                  ) {
                    return;
                  }
                  homeConfig.newArrivalProducts = [
                    ...homeConfig.newArrivalProducts,
                    e.detail.item._id,
                  ];
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.title}</svelte:fragment
                >
              </Autocomplete>
            </svelte:fragment>
          </TagInput>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Featured Collections</h3>
          <TagInput tags={homeConfig.featuredCollections}>
            <svelte:fragment slot="tag" let:tag>
              <Badge class="text-base" variant="primary">
                {$collection_cache.get(tag)?.name ?? tag}
                <Button
                  size="icon"
                  variant="ghost"
                  on:click={() => {
                    homeConfig.featuredCollections =
                      homeConfig.featuredCollections.filter((t) => t !== tag);
                  }}
                >
                  <X class="w-4 h-4" />
                </Button>
              </Badge>
            </svelte:fragment>
            <svelte:fragment slot="input" let:search_input>
              <Autocomplete
                class="border-0"
                placeholder="Search Collection"
                search={search_input}
                on:input={async (e) => {
                  await fetchCollections(e.detail.target.value);
                }}
                items={suggested_collections}
                on:selected={(e) => {
                  if (
                    homeConfig.featuredCollections.includes(e.detail.item._id)
                  ) {
                    return;
                  }
                  homeConfig.featuredCollections = [
                    ...homeConfig.featuredCollections,
                    e.detail.item._id,
                  ];
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>
            </svelte:fragment>
          </TagInput>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <!-- <div
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
    </div> -->
  </div>

  <Button on:click={handleSave}>Save</Button>
</div>
