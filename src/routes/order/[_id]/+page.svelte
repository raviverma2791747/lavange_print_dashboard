<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Loading.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import { getOrder, getProduct, updateOrder } from "../../../helper/endpoints";
  import CopyIcon from "../../../components/svg/CopyIcon.svelte";
  import { formatCurrency } from "../../../helper/utils";
  import DataTable from "../../../components/DataTable/DataTable.svelte";

  let loading = true;
  let order_id;
  let edit = false;

  let order = {
    name: "",
  };
  let products = new Map();

  const handleSave = async () => {
    await httpClient(`${updateOrder}/${order_id}`, {
      method: "POST",
      token: $token_store,
      payload: order,
    });
  };

  const initOrder = async () => {
    loading = true;
    const response = await httpClient(`${getOrder}/${order_id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      order = response.data.order;
    }
    loading = false;
  };

  const initProduct = async (product_id) => {
    loading = true;
    const response = await httpClient(`${getProduct}/${product_id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      products.set(product_id, response.data.product);
    }
    loading = false;
  };

  onMount(async () => {
    order_id = $page.params._id;

    if (order_id !== "create") {
      await initOrder();
      //   order.products.forEach((product) => {
      //     initProduct(product.product);
      //   });
    } else {
      edit = true;
    }

    loading = false;
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Order</h1>
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
      <h3 class="text-normal font-semibold mb-2 uppercase text-blue-500">
        #{order?._id}
        <button
          on:click={(e) => {
            e.stopImmediatePropagation();
            navigator.clipboard.writeText(order?._id);
          }}><CopyIcon class="w-6 h-6 text-gray-500" /></button
        >
      </h3>

      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Name</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.user.username}
            disabled={!edit}
          />
        </div>
        <div>
          <DataTable
            headers={[
              {
                key: "product",
                value: "Product",
                display: (product) => product.title,
              },
              { key: "quantity", value: "Quantity" },
              {
                key: "price",
                value: "Price",
                display: (price) => formatCurrency(price),
              },
            ]}
            rows={order.items.map((item, index) => {
              return { ...item, id: `${item.product._id}-${index}` };
            })}
          >
            <div class="mb-5">
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Search"
              />
            </div>
          </DataTable>
        </div>
        <div class="mb-5 flex text-gray-500">
          <div class="grow px-6 py-4">Total</div>
          <div class="grow px-6 py-4">
            {order.items.reduce((acc, item) => acc + item.quantity, 0)}
          </div>
          <div class="grow font-semibold px-6 py-4">
            {formatCurrency(
              order.items.reduce((acc, item) => acc + item.price, 0)
            )}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <button
    type="button"
    class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
    on:click={handleSave}
    class:hidden={!edit}
  >
    Save</button
  >
</div>
