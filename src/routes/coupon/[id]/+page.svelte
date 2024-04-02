<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import { user_cache, product_cache, category_cache , collection_cache} from "../../../helper/cache_store";
  import throttle from "lodash/throttle";
  import Autocomplete from "../../../components/Autocomplete.svelte";
  import {
    fetchUser,
    fetchProduct,
    updateCoupon,
    getCoupon,
    fetchCategory,
    fetchCollection
  } from "../../../helper/endpoints";
  import Spinner from "../../../components/Spinner.svelte";
  import ProductPill from "../../../components/Coupon/ProductPill.svelte";
  import UserPill from "../../../components/Coupon/UserPill.svelte";
  import { goto } from "$app/navigation";
  import CategoryPill from "../../../components/Coupon/CategoryPill.svelte";
  import CollectionPill from "../../../components/Coupon/CollectionPill.svelte";

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
  const CouponStatus = ["active", "draft", "archive"];
  const DiscountType = ["fixed", "percentage"];

  let coupon = {
    status: "draft",
    name: "",
    code: "",
    discount: {
      amount: 0,
      type: "fixed",
    },
    validity: {
      startDate: Date.now().toString(),
      endDate: Date.now().toString(),
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
      token: $token_store,
    });
    if (response.status === 200) {
      coupon = response.data.coupon;
    }

    loading = false;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateCoupon, {
      method: "POST",
      payload: coupon,
      token: $token_store,
    });
    if (response.status === 200) {
      goto(`/coupon/${response.data.coupon.id}`);
      loading = false;
      edit = false;
    }
  };

  const handleRemoveUser = async (id) => {
    coupon.users = coupon.users.filter((user) => user !== id);
  };

  const handleAddUser = async (id) => {
    if (coupon.users.includes(id)) {
      user_input = "";
      return;
    }
    coupon.users = [...coupon.users, id];
    user_input = "";
  };

  const handleAddProduct = async (id) => {
    if (coupon.products.includes(id)) {
      product_input = "";
      return;
    }
    coupon.products = [...coupon.products, id];
    product_input = "";
  };

  const handleRemoveProduct = async (id) => {
    coupon.products = coupon.products.filter((product) => product !== id);
  };

  const handleAddCategory = async (id) => {
    if (coupon.categories.includes(id)) {
      category_input = "";
      return;
    }
    coupon.categories = [...coupon.categories, id];
    category_input = "";
  };

  const handleRemoveCategory = async (id) => {
    coupon.categories = coupon.categories.filter((category) => category !== id);
  };

  const handleAddCollection = async (id) => {
    if (coupon.collections.includes(id)) {
      collection_input = "";
      return;
    }
    coupon.collections = [...coupon.collections, id];
    collection_input = "";
  };

  const handleRemoveCollection = async (id) => {
    coupon.collections = coupon.collections.filter((collection) => collection !== id);
  };

  const fetchUsers = async (search) => {
    if (search) {
      const response = await httpClient(fetchUser, {
        params: { search },
        token: $token_store,
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
        token: $token_store,
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
        token: $token_store,
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
      })
    }
  };

  const fetchCollections = async (search) => {
    if (search) {
      const response = await httpClient(fetchCollection, {
        params: { search },
        token: $token_store,
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
      })
    }
  };

  $: {
    if ($page.params.id !== "create") {
      initCoupon($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
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
    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading}
        <Spinner />
      {:else}
        <h2 class="text-xl font-semibold mb-4">Basic Details</h2>

        <div class="mb-4">
          <label
            for="status"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Status</label
          >
          <select
            id="status"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            bind:value={coupon.status}
            disabled={!edit}
          >
            {#each CouponStatus as status}
              <option value={status}>
                {status}
              </option>
            {/each}
          </select>
        </div>

        <div class="mb-5">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
            >Name</label
          >
          <input
            id="name"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={coupon.name}
            disabled={!edit}
          />
        </div>

        <div class="mb-5">
          <label for="code" class="block mb-2 text-sm font-medium text-gray-900"
            >Code</label
          >
          <input
            id="code"
            type="text"
            class="bg-gray-50 border uppercase border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Code"
            bind:value={coupon.code}
            disabled={$page.params.id !== "create" || !edit}
          />
        </div>
      {/if}
    </div>

    <!-- <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <h2 class="text-xl font-semibold mb-4">Order Details</h2>

        <div class="mb-5">
          <label
            for="discount-amount"
            class="block mb-2 text-sm font-medium text-gray-900">Discount</label
          >
          <input
            id="discount-amount"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Amount"
            bind:value={coupon.discount.amount}
            disabled={!edit}
          />
        </div>
      {/if}
    </div> -->

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Spinner />
      {:else if loading === false}
        <h2 class="text-xl font-semibold mb-4">Validity</h2>

        <div class="grid grid-cols-2 gap-4 w-fit">
          <div class="mb-5">
            <label
              for="validity-start"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Start Date</label
            >
            <input
              id="validity-start"
              type="date"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Amount"
              bind:value={coupon.validity.startDate}
              disabled={!edit}
            />
          </div>

          <div class="mb-5">
            <label
              for="validity-end"
              class="block mb-2 text-sm font-medium text-gray-900"
              >End Date</label
            >
            <input
              id="validity-end"
              type="date"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Amount"
              bind:value={coupon.validity.endDate}
              disabled={!edit}
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 w-fit">
          <div class="mb-5">
            <label
              for="redeem-limit"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Redeem Limit</label
            >
            <input
              id="redeem-limit"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Redeem limit"
              bind:value={coupon.redeem.limit}
              disabled={!edit}
            />
          </div>

          <div class="mb-5">
            <label
              for="redeem-indi-limit"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Redeem Individual Limit</label
            >
            <input
              id="redeem-indi-limit"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Redeem Individual limit"
              bind:value={coupon.redeem.individualLimit}
              disabled={!edit}
            />
          </div>
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Spinner />
      {:else if loading === false}
        <h2 class="text-xl font-semibold mb-4">Rules</h2>

        <div class="grid grid-cols-2 gap-4 w-fit">
          <div class="mb-5">
            <label
              for="discount-amount"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Discount</label
            >
            <input
              id="discount-amount"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Amount"
              bind:value={coupon.discount.amount}
              disabled={!edit}
            />
          </div>

          <div class="mb-4">
            <label
              for="discount-type"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Type</label
            >
            <select
              id="discount-type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              bind:value={coupon.discount.type}
              disabled={!edit}
            >
              {#each DiscountType as status}
                <option value={status}>
                  {status}
                </option>
              {/each}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 w-fit">
          <div class="mb-5">
            <label
              for="quantity-min"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Minimum Quantity</label
            >
            <input
              id="quantity-min"
              type="number"
              min="1"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Minium Quantity"
              bind:value={coupon.quantity.minimum}
              disabled={!edit}
            />
          </div>

          <div class="mb-5">
            <label
              for="quantity-max"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Maximum Quantity</label
            >
            <input
              id="quantity-max"
              type="number"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Minium Quantity"
              bind:value={coupon.quantity.maximum}
              disabled={!edit}
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 w-fit">
          <div class="mb-5">
            <label
              for="amount-min"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Minimum Amount</label
            >
            <input
              id="amount-min"
              type="number"
              min="0"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Minium Amount"
              bind:value={coupon.amount.minimum}
              disabled={!edit}
            />
          </div>

          <div class="mb-5">
            <label
              for="amount-max"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Maximum Amount</label
            >
            <input
              id="amount-max"
              type="number"
              min="0"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="Maximum Amount"
              bind:value={coupon.amount.maximum}
              disabled={!edit}
            />
          </div>
        </div>

        <div class="mb-5">
          <label
            for="users"
            class="block mb-2 text-sm font-medium text-gray-900">Users</label
          >

          <div class="border rounded-lg p-2 flex gap-4 flex-wrap items-center">
            {#each coupon.users as user}
              <UserPill
                id={user}
                {edit}
                on:remove={() => handleRemoveUser(user)}
              />
            {/each}

            <div class="grow">
              <Autocomplete
                placeholder="Search User"
                bind:search={user_input}
                items={suggested_users}
                on:selected={(e) => {
                  handleAddUser(e.detail.item._id);
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.username}</svelte:fragment
                >
              </Autocomplete>
            </div>
            <!-- <input
              class="outline-none"
              type="text"
              bind:value={user_input}
              on:keydown={(e) => handleAddUser(e)}
              placeholder="Enter username"
            /> -->
          </div>
        </div>

        <div class="mb-5">
          <label
            for="products"
            class="block mb-2 text-sm font-medium text-gray-900">Products</label
          >

          <div class="border rounded-lg p-2 flex gap-4 flex-wrap items-center">
            {#each coupon.products as product}
              <ProductPill
                id={product}
                {edit}
                on:remove={() => handleRemoveProduct(product)}
              />
            {/each}

            <div class="grow">
              <Autocomplete
                placeholder="Search Products"
                bind:search={product_input}
                items={suggested_products}
                on:selected={(e) => {
                  handleAddProduct(e.detail.item._id);
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.title}</svelte:fragment
                >
              </Autocomplete>
            </div>
            <!-- <input
              class="outline-none"
              type="text"
              bind:value={user_input}
              on:keydown={(e) => handleAddUser(e)}
              placeholder="Enter username"
            /> -->
          </div>
        </div>

        <div class="mb-5">
          <label
            for="categories"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Categories</label
          >

          <div class="border rounded-lg p-2 flex gap-4 flex-wrap items-center">
            {#each coupon.categories as category}
              <CategoryPill
                id={category}
                {edit}
                on:remove={() => handleRemoveCategory(category)}
              />
            {/each}

            <div class="grow">
              <Autocomplete
                placeholder="Search Category"
                bind:search={category_input}
                items={suggested_categories}
                on:selected={(e) => {
                  handleAddCategory(e.detail.item._id);
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>
            </div>
            <!-- <input
              class="outline-none"
              type="text"
              bind:value={user_input}
              on:keydown={(e) => handleAddUser(e)}
              placeholder="Enter username"
            /> -->
          </div>
        </div>

        <div class="mb-5">
          <label
            for="collections"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Collections</label
          >

          <div class="border rounded-lg p-2 flex gap-4 flex-wrap items-center">
            {#each coupon.collections as collection}
              <CollectionPill
                id={collection}
                {edit}
                on:remove={() => handleRemoveCollection(collection)}
              />
            {/each}

            <div class="grow">
              <Autocomplete
                placeholder="Search Collection"
                bind:search={collection_input}
                items={suggested_collections}
                on:selected={(e) => {
                  handleAddCollection(e.detail.item._id);
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>
            </div>
            <!-- <input
              class="outline-none"
              type="text"
              bind:value={user_input}
              on:keydown={(e) => handleAddUser(e)}
              placeholder="Enter username"
            /> -->
          </div>
        </div>
      {/if}
    </div>
  </div>

  <button
    class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
    class:hidden={edit}
    on:click={() => {
      edit = true;
    }}
  >
    Edit
  </button>

  <button
    type="button"
    class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
    on:click={handleSave}
    class:hidden={!edit}
  >
    Save</button
  >
</div>
