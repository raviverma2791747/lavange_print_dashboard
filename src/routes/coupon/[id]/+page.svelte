<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import {
    user_cache,
    product_cache,
    category_cache,
    collection_cache,
  } from "../../../helper/cache_store";
  import throttle from "lodash/throttle";
  import Autocomplete from "../../../components/Autocomplete.svelte";
  import {
    fetchUser,
    fetchProduct,
    updateCoupon,
    getCoupon,
    fetchCategory,
    fetchCollection,
    getUser,
    getProduct,
    getCategory,
    getCollection,
  } from "../../../helper/endpoints";
  import Spinner from "../../../components/Spinner.svelte";
  import ProductPill from "../../../components/Coupon/ProductPill.svelte";
  import UserPill from "../../../components/Coupon/UserPill.svelte";
  import { goto } from "$app/navigation";
  import CategoryPill from "../../../components/Coupon/CategoryPill.svelte";
  import CollectionPill from "../../../components/Coupon/CollectionPill.svelte";
  import * as Card from "$lib/components/ui/card";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select";
  import {
    DATE_FORMAT,
    DATE_TIME_FORMAT,
    NUMBER_TYPE,
    STATUS,
  } from "../../../helper/constants";
  import { formatDate, getByValue, toastMessage } from "../../../helper/utils";
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import { cn } from "$lib/utils.ts";
  import Button from "$lib/components/ui/button/button.svelte";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover";
  import {
    DateFormatter,
    getLocalTimeZone,
    CalendarDate,
    today,
  } from "@internationalized/date";
  import { parseISO } from "date-fns";
  import TagInput from "../../../components/TagInput.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import { X } from "lucide-svelte";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let loading = true;
  let edit = false;
  let user_input;
  let product_input;
  let category_input;
  let collection_input;
  let suggested_users = [];
  let suggested_products = [];
  let suggested_categories = [];
  let suggested_collections = [];

  let coupon = {
    status: STATUS.DRAFT,
    name: "",
    code: "",
    discount: {
      amount: 0,
      type: NUMBER_TYPE.FIXED,
    },
    validity: {
      startDate: today(getLocalTimeZone()),
      endDate: today(getLocalTimeZone()),
    },
    redeem: {
      limit: 0,
      individualLimit: 0,
    },
    quantity: {
      minimum: 1,
      maximum: 0,
    },
    amount: {
      minimum: 0,
      maximum: 0,
    },
    users: [],
    products: [],
    categories: [],
    collections: [],
  };
  const initCoupon = async (id) => {
    loading = true;
    const response = await httpClient(`${getCoupon}/${id}`, {
      params: { _id: id },
    });
    if (response.status === 200) {
      coupon = response.data.coupon;
      const startDate = new Date(parseISO(coupon.validity.startDate));
      const endDate = new Date(parseISO(coupon.validity.endDate));
      coupon = {
        ...coupon,
        validity: {
          startDate: new CalendarDate(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate()
          ),
          endDate: new CalendarDate(
            endDate.getFullYear(),
            endDate.getMonth() + 1,
            endDate.getDate()
          ),
        },
      };
    }
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateCoupon, {
      method: "POST",
      payload: {
        ...coupon,
        validity: {
          startDate: coupon.validity.startDate.toDate(getLocalTimeZone()),
          endDate: coupon.validity.endDate.toDate(getLocalTimeZone()),
        },
      },
    });
    if (response.status === 200) {
      //goto(`/coupon/${response.data.coupon.id}`, { replaceState: true });
      toastMessage(
        `Coupon ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
      await initCoupon($page.params.id);
      loading = false;
      edit = false;
    }
  };

  const fetchUsers = async (search) => {
    if (search) {
      const response = await httpClient(fetchUser, {
        params: { search },
      });

      if (response.status === 200) {
        suggested_users = response.data.users ?? [];
      } else {
        suggested_users = [];
      }

      suggested_users.forEach((user) => {
        if (!$user_cache.has(user._id)) {
          $user_cache.set(user._id, user);
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

  const fetchCategories = async (search) => {
    if (search) {
      const response = await httpClient(fetchCategory, {
        params: { search },
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

  const getCollectionById = async (id) => {
    if ($collection_cache.has(id)) {
      return $collection_cache.get(id);
    } else {
      const response = await httpClient(`${getCollection}/${id}`);
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
      const response = await httpClient(`${getProduct}/${id}`);
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

  const getUserById = async (id) => {
    if ($user_cache.has(id)) {
      return $user_cache.get(id);
    } else {
      const response = await httpClient(`${getUser}/${id}`);
      if (response.status === 200) {
        let user = response.data.user ?? null;
        if (user) {
          $user_cache.set(user._id, user);
        }
        return user;
      }
      return null;
    }
  };

  const init = async (id) => {
    if ($page.params.id !== "create") {
      await initCoupon(id);

      await Promise.all(coupon.users.map((user) => getUserById(user)));

      await Promise.all(
        coupon.products.map((product) => getProductById(product))
      );

      await Promise.all(
        coupon.categories.map((category) => getCategoryById(category))
      );
      await Promise.all(
        coupon.collections.map((collection) => getCollectionById(collection))
      );

      loading = false;
    } else {
      loading = false;
      edit = true;
    }
  };

  $: {
    init($page.params.id);
  }

  const throttledFetchUsers = throttle(fetchUsers, 1000, {
    leading: true,
    trailing: true,
  });

  const throttledFetchProducts = throttle(fetchProducts, 1000, {
    leading: true,
    trailing: true,
  });

  const throttledFetchCategories = throttle(fetchCategories, 1000, {
    leading: true,
    trailing: true,
  });

  const throttledFetchCollections = throttle(fetchCollections, 1000, {
    leading: true,
    trailing: true,
  });

  $: {
    throttledFetchUsers(user_input);
  }

  $: {
    throttledFetchProducts(product_input);
  }

  $: {
    throttledFetchCategories(category_input);
  }

  $: {
    throttledFetchCollections(collection_input);
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Add Coupon</h1>
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
    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h2 class="text-xl font-semibold mb-4">Basic Details</h2>

          <div class="mb-4">
            <Label for="status">Status</Label>

            <Select.Root
              disabled={!edit}
              id="status"
              selected={{
                value: coupon.status,
                label: getByValue(STATUS, coupon.status),
              }}
              onSelectedChange={(v) => {
                v && (coupon.status = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(STATUS) as [key, value]}
                  <Select.Item {value} label={key} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="mb-5">
            <Label for="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              bind:value={coupon.name}
              disabled={!edit}
            />
          </div>

          <div class="mb-5">
            <Label for="code">Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Code"
              bind:value={coupon.code}
              disabled={$page.params.id !== "create" || !edit}
            />
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <!-- <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <h2 class="text-xl font-semibold mb-4">Order Details</h2>

        <div class="mb-5">
          <Label
            for="discount-amount"
            >Discount</Label
          >
          <Input
            id="discount-amount"
            type="text"
            
            placeholder="Amount"
            bind:value={coupon.discount.amount}
            disabled={!edit}
          />
        </div>
      {/if}
    </div> -->

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h2 class="text-xl font-semibold mb-4">Validity</h2>

          <div class="grid grid-cols-2 gap-4 w-fit">
            <div class="mb-5 flex flex-col">
              <Label for="validity-start">Start Date</Label>

              <Popover.Root>
                <Popover.Trigger asChild let:builder>
                  <Button
                    disabled={!edit}
                    variant="outline"
                    class={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !coupon.validity.startDate && "text-muted-foreground"
                    )}
                    builders={[builder]}
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {coupon.validity.startDate
                      ? df.format(
                          coupon.validity.startDate.toDate(getLocalTimeZone())
                        )
                      : "Pick a date"}
                  </Button>
                </Popover.Trigger>
                <Popover.Content class="w-auto p-0">
                  <Calendar
                    bind:value={coupon.validity.startDate}
                    initialFocus
                  />
                </Popover.Content>
              </Popover.Root>
            </div>

            <div class="mb-5 flex flex-col">
              <Label for="validity-end">End Date</Label>
              <Popover.Root>
                <Popover.Trigger asChild let:builder>
                  <Button
                    disabled={!edit}
                    variant="outline"
                    class={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !coupon.validity.endDate && "text-muted-foreground"
                    )}
                    builders={[builder]}
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {coupon.validity.endDate
                      ? df.format(
                          coupon.validity.endDate.toDate(getLocalTimeZone())
                        )
                      : "Pick a date"}
                  </Button>
                </Popover.Trigger>
                <Popover.Content class="w-auto p-0">
                  <Calendar bind:value={coupon.validity.endDate} initialFocus />
                </Popover.Content>
              </Popover.Root>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 w-fit">
            <div class="mb-5">
              <Label for="redeem-limit">Redeem Limit</Label>
              <Input
                id="redeem-limit"
                type="text"
                placeholder="Redeem limit"
                bind:value={coupon.redeem.limit}
                disabled={!edit}
              />
            </div>

            <div class="mb-5">
              <Label for="redeem-indi-limit">Redeem Individual Limit</Label>
              <Input
                id="redeem-indi-limit"
                type="text"
                placeholder="Redeem Individual limit"
                bind:value={coupon.redeem.individualLimit}
                disabled={!edit}
              />
            </div>
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h2 class="text-xl font-semibold mb-4">Rules</h2>

          <div class="grid grid-cols-2 gap-4 w-fit">
            <div class="mb-5">
              <Label for="discount-amount">Discount</Label>
              <Input
                id="discount-amount"
                type="text"
                placeholder="Amount"
                bind:value={coupon.discount.amount}
                disabled={!edit}
              />
            </div>

            <div class="mb-4">
              <Label for="discount-type">Type</Label>

              <Select.Root
                disabled={!edit}
                selected={{
                  value: coupon.discount.type,
                  label: getByValue(NUMBER_TYPE, coupon.discount.type),
                }}
                onSelectedChange={(v) => {
                  v && (coupon.discount.type = v.value);
                }}
              >
                <Select.Trigger>
                  <Select.Value class="capitalize" placeholder="Type" />
                </Select.Trigger>
                <Select.Content>
                  {#each Object.entries(NUMBER_TYPE) as [key, value]}
                    <Select.Item {value} label={key} />
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 w-fit">
            <div class="mb-5">
              <Label for="quantity-min">Minimum Quantity</Label>
              <Input
                id="quantity-min"
                type="number"
                min="1"
                placeholder="Minium Quantity"
                value={coupon.quantity.minimum}
                disabled={!edit}
                on:input={(e) => {
                  coupon.quantity.minimum = e.target.value
                    ? Number(e.target.value)
                    : coupon.quantity.minimum;
                }}
              />
            </div>

            <div class="mb-5">
              <Label for="quantity-max">Maximum Quantity</Label>
              <Input
                id="quantity-max"
                type="number"
                placeholder="Minium Quantity"
                value={coupon.quantity.maximum}
                disabled={!edit}
                on:input={(e) => {
                  coupon.quantity.maximum = e.target.value
                    ? Number(e.target.value)
                    : coupon.quantity.maximum;
                }}
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 w-fit">
            <div class="mb-5">
              <Label for="amount-min">Minimum Amount</Label>
              <Input
                id="amount-min"
                type="number"
                min="0"
                placeholder="Minium Amount"
                value={coupon.amount.minimum}
                disabled={!edit}
                on:input={(e) => {
                  coupon.amount.minimum = e.target.value
                    ? Number(e.target.value)
                    : coupon.amount.minimum;
                }}
              />
            </div>

            <div class="mb-5">
              <Label for="amount-max">Maximum Amount</Label>
              <Input
                id="amount-max"
                type="number"
                min="0"
                placeholder="Maximum Amount"
                value={coupon.amount.maximum}
                disabled={!edit}
                on:input={(e) => {
                  coupon.amount.maximum = e.target.value
                    ? Number(e.target.value)
                    : coupon.amount.maximum;
                }}
              />
            </div>
          </div>

          <div class="mb-5">
            <Label for="users">Users</Label>

            <TagInput tags={coupon.users} disabled={!edit}>
              <svelte:fragment slot="tag" let:tag>
                <Badge class="text-base" variant="primary">
                  {$user_cache.get(tag)?.username ?? tag}
                  <Button
                    disabled={!edit}
                    size="icon"
                    variant="ghost"
                    on:click={() => {
                      coupon.users = coupon.users.filter((t) => t !== tag);
                    }}
                  >
                    <X class="w-4 h-4" />
                  </Button>
                </Badge>
              </svelte:fragment>
              <svelte:fragment slot="input" let:search_input>
                <Autocomplete
                  disabled={!edit}
                  class="border-0"
                  placeholder="Search User"
                  search={search_input}
                  on:input={async (e) => {
                    await fetchUsers(e.detail.target.value);
                  }}
                  items={suggested_users}
                  on:selected={(e) => {
                    if (coupon.users.includes(e.detail.item._id)) {
                      return;
                    }
                    coupon.users = [...coupon.users, e.detail.item._id];
                  }}
                >
                  <svelte:fragment slot="item" let:item
                    >{item.username}</svelte:fragment
                  >
                </Autocomplete>
              </svelte:fragment>
            </TagInput>
          </div>

          <div class="mb-5">
            <Label for="products">Products</Label>

            <TagInput tags={coupon.products} disabled={!edit}>
              <svelte:fragment slot="tag" let:tag>
                <Badge class="text-base" variant="primary">
                  {$product_cache.get(tag)?.title ?? tag}
                  <Button
                    disabled={!edit}
                    size="icon"
                    variant="ghost"
                    on:click={() => {
                      coupon.products = coupon.products.filter(
                        (t) => t !== tag
                      );
                    }}
                  >
                    <X class="w-4 h-4" />
                  </Button>
                </Badge>
              </svelte:fragment>
              <svelte:fragment slot="input" let:search_input>
                <Autocomplete
                  disabled={!edit}
                  class="border-0"
                  placeholder="Search Product"
                  search={search_input}
                  on:input={async (e) => {
                    await fetchProducts(e.detail.target.value);
                  }}
                  items={suggested_products}
                  on:selected={(e) => {
                    if (coupon.products.includes(e.detail.item._id)) {
                      return;
                    }
                    coupon.products = [...coupon.products, e.detail.item._id];
                  }}
                >
                  <svelte:fragment slot="item" let:item
                    >{item.title}</svelte:fragment
                  >
                </Autocomplete>
              </svelte:fragment>
            </TagInput>
          </div>

          <div class="mb-5">
            <Label for="categories">Categories</Label>

            <TagInput tags={coupon.categories} disabled={!edit}>
              <svelte:fragment slot="tag" let:tag>
                <Badge class="text-base" variant="primary">
                  {$category_cache.get(tag)?.name ?? tag}
                  <Button
                    disabled={!edit}
                    size="icon"
                    variant="ghost"
                    on:click={() => {
                      coupon.categories = coupon.categories.filter(
                        (t) => t !== tag
                      );
                    }}
                  >
                    <X class="w-4 h-4" />
                  </Button>
                </Badge>
              </svelte:fragment>
              <svelte:fragment slot="input" let:search_input>
                <Autocomplete
                  disabled={!edit}
                  class="border-0"
                  placeholder="Search Category"
                  search={search_input}
                  on:input={async (e) => {
                    await fetchCategories(e.detail.target.value);
                  }}
                  items={suggested_categories}
                  on:selected={(e) => {
                    if (coupon.categories.includes(e.detail.item._id)) {
                      return;
                    }
                    coupon.categories = [
                      ...coupon.categories,
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
          </div>

          <div class="mb-5">
            <Label for="collections">Collections</Label>
            <TagInput tags={coupon.collections} disabled={!edit}>
              <svelte:fragment slot="tag" let:tag>
                <Badge class="text-base" variant="primary">
                  {$collection_cache.get(tag)?.name ?? tag}
                  <Button
                    disabled={!edit}
                    size="icon"
                    variant="ghost"
                    on:click={() => {
                      coupon.collections = coupon.collections.filter(
                        (t) => t !== tag
                      );
                    }}
                  >
                    <X class="w-4 h-4" />
                  </Button>
                </Badge>
              </svelte:fragment>
              <svelte:fragment slot="input" let:search_input>
                <Autocomplete
                  disabled={!edit}
                  class="border-0"
                  placeholder="Search Collection"
                  search={search_input}
                  on:input={async (e) => {
                    await fetchCollections(e.detail.target.value);
                  }}
                  items={suggested_collections}
                  on:selected={(e) => {
                    if (coupon.collections.includes(e.detail.item._id)) {
                      return;
                    }
                    coupon.collections = [
                      ...coupon.collections,
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
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>
  </div>

  {#if edit}
    <Button on:click={handleSave}>Save</Button>
  {:else}
    <Button
      on:click={() => {
        edit = true;
      }}
    >
      Edit
    </Button>
  {/if}
</div>
