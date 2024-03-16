<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import {
    getOrder,
    getProduct,
    updateOrder,
    updateOrderShipping,
    updateOrderStatus,
  } from "../../../helper/endpoints";
  import CopyIcon from "../../../components/svg/CopyIcon.svelte";
  import {
    formatCurrency,
    formatDate,
    getVariant,
    getVariantSchema,
  } from "../../../helper/utils";
  import DataTable from "../../../components/DataTable/DataTable.svelte";
  import { DATE_TIME_FORMAT } from "../../../helper/constants";

  let loading = true;
  let order_id;
  let edit = false;
  let edit_status = false;
  let edit_shipping = false;
  const OrderStatus = [
    "pending",
    "placed",
    "prepared",
    "dispatched",
    "cancelled",
    "delivered",
    "returned",
  ];

  const PaymentStatus = ["pending", "success", "failed", "refunded"];
  const PaymentType = ["cod", "online"];
  const PaymentGateway = ["paytm", "phonepe", "razorpay", "none"];

  let order = {
    // name: "",
    // email: "",
    // phone: "",
    // address: "",
    // orderItems: [],
    shipping: {
      trackingId: "",
      trackingUrl: "",
      price: 0,
    },
    // status: "pending",
    // paymentStatus: "pending",
    // paymentType: "cod",
    // paymentGateway: "none",
    // transactionId: "",
  };
  let order_default = {};
  let products = new Map();

  const handleSave = async () => {
    await httpClient(`${updateOrder}/${order_id}`, {
      method: "POST",
      token: $token_store,
      payload: order,
    });
  };

  const handleUpdateStatus = async () => {
    const response = await httpClient(updateOrderStatus, {
      method: "POST",
      token: $token_store,
      payload: {
        _id: order_id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentType: order.paymentType,
        paymentGateway: order.paymentGateway,
      },
    });

    if (response.status === 200) {
      edit_status = false;
      initOrder();
    }
  };

  const handleUpdateShipping = async () => {
    const response = await httpClient(updateOrderShipping, {
      method: "POST",
      token: $token_store,
      payload: {
        _id: order_id,
        shipping: order.shipping,
        address: order.address,
      },
    });

    if (response.status === 200) {
      console.log("ok");
      edit_shipping = false;
      initOrder();
    }
  };

  const handleUpdateShippingCancel = async () => {
    order = {
      ...order,
      shipping: structuredClone(order_default.shipping),
      address: structuredClone(order_default.address),
    };
    edit_shipping = false;
  };

  const handleUpdateStatusCancel = async () => {
    order = {
      ...order,
      status: order_default.status,
      paymentStatus: order_default.paymentStatus,
      paymentType: order_default.paymentType,
      paymentGateway: order_default.paymentGateway,
    };
    // order.status = order_default.status;
    // order.paymentStatus = order_default.paymentStatus;
    // order.paymentType = order_default.paymentType;
    // order.paymentGateway = order_default.paymentGateway;
    // edit_status = false;
    edit_status = false;
  };

  const initOrder = async () => {
    loading = true;
    const response = await httpClient(`${getOrder}/${order_id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      order = response.data.order;
      order_default = structuredClone(response.data.order);
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

  <div
    class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10 mb-4"
  >
    {#if loading === true}
      <Loading />
    {:else if loading === false}
      <h2 class="text-xl font-semibold mb-4">Order Status</h2>
      <h3 class="text-normal font-semibold mb-2 uppercase text-blue-500">
        #{order?._id}
        <button
          on:click={(e) => {
            e.stopImmediatePropagation();
            navigator.clipboard.writeText(order?._id);
          }}><CopyIcon class="w-6 h-6 text-gray-500" /></button
        >
      </h3>

      <div class="mb-4 flex gap-4">
        <div>
          <div class="font-semibold">Order Placed:</div>
          <div>{formatDate(order.createdAt, DATE_TIME_FORMAT)}</div>
        </div>
        <div>
          <div class="font-semibold">Order Modified:</div>
          <div>{formatDate(order.updatedAt, DATE_TIME_FORMAT)}</div>
        </div>
      </div>

      <div class="mb-4">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Order Status</label
        >
        <select
          id="status"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          bind:value={order.status}
          disabled={!edit_status}
        >
          {#each OrderStatus as status}
            <option value={status}>
              {status}
            </option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Payment Status</label
        >
        <select
          id="status"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={order.paymentStatus}
          disabled={!edit_status}
        >
          {#each PaymentStatus as status}
            <option value={status}>
              {status}
            </option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Payment Type</label
        >
        <select
          id="status"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={order.paymentType}
          disabled={!edit_status}
        >
          {#each PaymentType as status}
            <option value={status}>
              {status}
            </option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Payment Gateway</label
        >
        <select
          id="status"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={order.paymentGateway}
          disabled={!edit_status}
        >
          {#each PaymentGateway as status}
            <option value={status}>
              {status}
            </option>
          {/each}
        </select>
      </div>

      <div class="mb-5">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900"
          >Transaction ID</label
        >
        <input
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Transaction ID"
          bind:value={order.transactionId}
          disabled={true}
        />
      </div>

      <div class="mb-4">
        <div class="font-semibold mb-2">Timeline</div>
        <ol class="relative border-s border-purple-300 mb-4">
          {#each order.timeline as item}
            <li class="ms-4">
              <div
                class="absolute w-3 h-3 bg-purple-500 rounded-full mt-1.5 -start-1.5 border border-white"
              ></div>
              <time
                class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
                >{formatDate(item.updatedAt, DATE_TIME_FORMAT)}</time
              >
              <h3 class="text-lg font-semibold text-gray-900 capitalize">
                {item.status}
              </h3>
              <p class="text-base font-normal text-gray-500">
                {item.message}
              </p>
            </li>
          {/each}
        </ol>
      </div>

      {#if edit_status}
        <div class="flex gap-4">
          <button
            type="button"
            class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            on:click={handleUpdateStatus}
          >
            Save</button
          >

          <button
            on:click={handleUpdateStatusCancel}
            type="button"
            class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
          >
            Cancel
          </button>
        </div>
      {:else}
        <button
          on:click={() => {
            edit_status = true;
          }}
          type="button"
          class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
        >
          Edit
        </button>
      {/if}
    {/if}
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <h2 class="text-xl font-semibold mb-4">Customer Details</h2>
        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">User ID</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.user._id}
            disabled={!edit}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Username</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.user.username}
            disabled={!edit}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >First name</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.user.firstName}
            disabled={!edit}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Last name</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.user.lastName}
            disabled={!edit}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Email</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.user.email}
            disabled={!edit}
          />
        </div>
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <h2 class="text-xl font-semibold mb-4">Shipping Details</h2>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Full name (First and Last name)</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.fullName}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Mobile Number</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.mobile}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Type</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.type}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Pincode</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.pincode}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Flat, House no., Building, Company, Apartment</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.addressLine1}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Area, Street, Sector, Village</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.addressLine2}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Landmark</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.landmark}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Town/City</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.city}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            State</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.address.state}
            disabled={!edit_shipping}
          />
        </div>

        <h2 class="text-xl font-semibold mb-4">Shipping Vendor</h2>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Tracking ID</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.shipping.trackingId}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Tracking URL</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.shipping.trackingUrl}
            disabled={!edit_shipping}
          />
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Shipping Price</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Name"
            bind:value={order.shipping.price}
            disabled={!edit_shipping}
          />
        </div>

        {#if edit_shipping}
          <div class="flex gap-4">
            <button
              type="button"
              class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
              on:click={handleUpdateShipping}
            >
              Save</button
            >

            <button
              on:click={handleUpdateShippingCancel}
              type="button"
              class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
            >
              Cancel
            </button>
          </div>
        {:else}
          <button
            on:click={() => {
              edit_shipping = true;
            }}
            type="button"
            class="bg-gray-50 border font-semibold border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400"
          >
            Edit
          </button>
        {/if}
      {/if}
    </div>

    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <h2 class="text-xl font-semibold mb-4">Order Details</h2>

        <div class="grid grid-cols-4 gap-4">
          <div class="font-semibold">#ID</div>
          <div class="font-semibold">Title</div>
          <div class="font-semibold">Quantity</div>
          <div class="font-semibold">Price</div>

          {#each order.items as item}
            <a
            target="_blank"
              href={`/product/${item.product._id}`}
              class=" col-span-4 border-b py-4 border-gray-300 grid grid-cols-4 gap-4 hover:bg-gray-200 cursor-pointer"
            >
               <div class="uppercase">
                {item.product._id}
               </div>
              <div>
                {item.product.title}

                {#if item.variant && item.variantSchema}
                  <div class="flex gap-2 flex-wrap">
                    {#each Object.entries(getVariant(getVariantSchema(item.product, item.variantSchema), item.variant).attributes).map( ([key, value]) => {
                        // console.log(getVariantSchema(item.product, item.variantSchema).variantSchema.find( (si) => {
                        //       return si.name === key;
                        //     } ).options.find((o)=>{
                        //       return o.value === value
                        //     }));
                        return getVariantSchema(item.product, item.variantSchema)
                          .variantSchema.find((si) => {
                            return si.name === key;
                          })
                          .options.find((o) => {
                            return o.value === value;
                          }).displayName;
                      } ) as attribute}
                      <div
                        class="border border-purple-500 text-purple-500 bg-purple-200 px-2 rounded-lg text-sm"
                      >
                        {attribute}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
              <div>
                {item.quantity}
              </div>
              <div>
                {formatCurrency(item.price)}
              </div>
            </a>
          {/each}

          <div class="font-semibold">Total</div>
          <div></div>
          <div class="font-semibold">
            {order.items.reduce((acc, item) => acc + item.quantity, 0)}
          </div>
          <div class="font-semibold">
            {formatCurrency(
              order.items.reduce((acc, item) => acc + item.price, 0)
            )}
          </div>
        </div>
        <div>
          <!-- <DataTable
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
          </DataTable> -->
        </div>
        <!-- <div class="mb-5 flex text-gray-500">
          <div class="grow px-6 py-4">Total</div>
          <div class="grow px-6 py-4">
            {order.items.reduce((acc, item) => acc + item.quantity, 0)}
          </div>
          <div class="grow font-semibold px-6 py-4">
            {formatCurrency(
              order.items.reduce((acc, item) => acc + item.price, 0)
            )}
          </div>
        </div> -->
      {/if}
    </div>
  </div>
  <!-- 
  <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      {#if loading === true}
        <Loading />
      {:else if loading === false}{/if}
    </div> -->

  <!-- <button
    type="button"
    class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
    on:click={handleSave}
  >
    Save</button
  > -->
</div>
