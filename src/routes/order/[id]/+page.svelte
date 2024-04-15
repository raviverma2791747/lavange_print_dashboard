<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import * as Table from "$lib/components/ui/table";
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
    getByValue,
  } from "../../../helper/utils";
  import * as Card from "$lib/components/ui/card";
  import Spinner from "../../../components/Spinner.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import {
    DATE_TIME_FORMAT,
    ORDER_STATUS,
    PAYMENT_STATUS,
    PAYMENT_GATEWAY,
    PAYMENT_MODE,
  } from "../../../helper/constants";
  import * as Select from "$lib/components/ui/select";
  import Input from "$lib/components/ui/input/input.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";

  let loading = true;
  let edit = false;
  let edit_status = false;
  let edit_shipping = false;
  let edit_shipping_vendor = false;

  let order = {
    status: ORDER_STATUS.PENDING,
    createdAt: "",
    updatedAt: "",
    user: null,
    shipping: {
      trackingId: "",
      trackingUrl: "",
      price: 0,
    },
    items: [],
    timeline: [],
    paymentStatus: PAYMENT_STATUS.PENDING,
    paymentMode: PAYMENT_MODE.ONLINE,
    paymentGateway: PAYMENT_GATEWAY.NONE,
    transactionId: "",
    address: {
      state: "",
      city: "",
      country: "",
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      fullName: "",
      mobile: "",
    },
  };
  let order_default = {
    status: ORDER_STATUS.PENDING,
    createdAt: "",
    updatedAt: "",
    user: null,
    shipping: {
      trackingId: "",
      trackingUrl: "",
      price: 0,
    },
    items: [],
    timeline: [],
    paymentStatus: PAYMENT_STATUS.PENDING,
    paymentMode: PAYMENT_MODE.ONLINE,
    paymentGateway: PAYMENT_GATEWAY.NONE,
    transactionId: "",
    address: {
      state: "",
      city: "",
      country: "",
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      fullName: "",
      mobile: "",
    },
  };
  let products = new Map();

  const handleSave = async () => {
    await httpClient(`${updateOrder}/${$page.params.id}`, {
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
        _id: $page.params.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMode: order.paymentMode,
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
        _id: $page.params.id,
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
    edit_shipping_vendor = false;
  };

  const handleUpdateStatusCancel = async () => {
    order = {
      ...order,
      status: order_default.status,
      paymentStatus: order_default.paymentStatus,
      paymentMode: order_default.paymentMode,
      paymentGateway: order_default.paymentGateway,
    };
    // order.status = order_default.status;
    // order.paymentStatus = order_default.paymentStatus;
    // order.paymentMode = order_default.paymentMode;
    // order.paymentGateway = order_default.paymentGateway;
    // edit_status = false;
    edit_status = false;
  };

  const initOrder = async (id) => {
    loading = true;
    const response = await httpClient(`${getOrder}/${id}`, {
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

  $: {
    if ($page.params.id !== "create") {
      initOrder($page.params.id);
    } else {
      edit = true;
      loading = false;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Order</h1>
  </div>

  <div class="grid lg:grid-cols-2 gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h2 class="text-xl font-semibold mb-4">Order Status</h2>
          {#if $page.params.id !== "create"}
            <h3 class="text-normal font-semibold mb-2 uppercase">
              #{order?._id}
              <Button
                variant="icon"
                on:click={(e) => {
                  e.stopImmediatePropagation();
                  navigator.clipboard.writeText(order?._id);
                }}><CopyIcon class="w-6 h-6" /></Button
              >
            </h3>
          {/if}

          {#if $page.params.id !== "create"}
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
          {/if}

          <div class="mb-4">
            <Label for="status">Order Status</Label>
            <Select.Root
              disabled={!edit_status}
              selected={{
                value: order.status,
                label: getByValue(ORDER_STATUS, order.status),
              }}
              onSelectedChange={(v) => {
                v && (order.status = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(ORDER_STATUS) as [key, value]}
                  <Select.Item {value} label={key} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="mb-4">
            <Label for="paymentStatus">Payment Status</Label>
            <Select.Root
              disabled={!edit_status}
              selected={{
                value: order.paymentStatus,
                label: getByValue(PAYMENT_STATUS, order.paymentStatus),
              }}
              onSelectedChange={(v) => {
                v && (order.paymentStatus = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(PAYMENT_STATUS) as [key, value]}
                  <Select.Item {value} label={key} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="mb-4">
            <Label for="paymentMode">Payment Mode</Label>
            <Select.Root
              disabled={!edit_status}
              selected={{
                value: order.paymentMode,
                label: getByValue(PAYMENT_MODE, order.paymentMode),
              }}
              onSelectedChange={(v) => {
                v && (order.paymentMode = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(PAYMENT_MODE) as [key, value]}
                  <Select.Item {value} label={key} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="mb-4">
            <Label for="paymentGateway">Payment Gateway</Label>
            <Select.Root
              disabled={!edit_status}
              selected={{
                value: order.paymentGateway,
                label: getByValue(PAYMENT_GATEWAY, order.paymentGateway),
              }}
              onSelectedChange={(v) => {
                v && (order.paymentGateway = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(PAYMENT_GATEWAY) as [key, value]}
                  <Select.Item {value} label={key} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="mb-5">
            <Label for="title">Transaction ID</Label>
            <Input
              type="text"
              placeholder="Transaction ID"
              bind:value={order.transactionId}
              disabled={true}
            />
          </div>

          <div class="mb-4">
            <div class="font-semibold mb-2">Timeline</div>
            {#if order.timeline.length === 0}
              <div class="text-gray-500">No Timeline</div>
            {:else}
              <ol class="relative border-s border-purple-300 mb-4">
                {#each order.timeline as item}
                  <li class="ms-4">
                    <div
                      class="absolute w-3 h-3 bg-purple-500 rounded-full mt-1.5 -start-1.5 border border-white"
                    ></div>
                    <time class="mb-1 text-sm font-normal leading-none"
                      >{formatDate(item.updatedAt, DATE_TIME_FORMAT)}</time
                    >
                    <h3 class="text-lg font-semibold capitalize">
                      {getByValue(ORDER_STATUS, item.status)}
                    </h3>
                    <p class="text-base font-normal text-gray-500">
                      {item.message}
                    </p>
                  </li>
                {/each}
              </ol>
            {/if}
          </div>

          {#if edit_status}
            <div class="flex gap-4">
              <Button on:click={handleUpdateStatus}>Save</Button>

              <Button variant="outline" on:click={handleUpdateStatusCancel}>Cancel</Button>
            </div>
          {:else}
            <Button
              on:click={() => {
                edit_status = true;
              }}
            >
              Edit
            </Button>
          {/if}
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h2 class="text-xl font-semibold mb-4">Customer Details</h2>

          {#if order.user}
            <div class="mb-5">
              <Label for="title">User ID</Label>
              <Input
                type="text"
                placeholder="Name"
                bind:value={order.user._id}
                disabled={!edit}
              />
            </div>

            <div class="mb-5">
              <Label for="title">Username</Label>
              <Input
                type="text"
                placeholder="Name"
                bind:value={order.user.username}
                disabled={!edit}
              />
            </div>

            <div class="mb-5">
              <Label for="title">First name</Label>
              <Input
                type="text"
                placeholder="Name"
                bind:value={order.user.firstName}
                disabled={!edit}
              />
            </div>

            <div class="mb-5">
              <Label for="title">Last name</Label>
              <Input
                type="text"
                placeholder="Name"
                bind:value={order.user.lastName}
                disabled={!edit}
              />
            </div>

            <div class="mb-5">
              <Label for="title">Email</Label>
              <Input
                type="text"
                placeholder="Name"
                bind:value={order.user.email}
                disabled={!edit}
              />
            </div>
          {:else}
            No user
          {/if}
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h2 class="text-xl font-semibold mb-4">Shipping Details</h2>

          <div class="mb-5">
            <Label for="title">Full name (First and Last name)</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.fullName}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Mobile Number</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.mobile}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Type</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.type}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Pincode</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.pincode}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">
              Flat, House no., Building, Company, Apartment</Label
            >
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.addressLine1}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Area, Street, Sector, Village</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.addressLine2}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Landmark</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.landmark}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Town/City</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.city}
              disabled={!edit_shipping}
            />
          </div>

          <div class="mb-5">
            <Label for="title">State</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.address.state}
              disabled={!edit_shipping}
            />
          </div>

          {#if edit_shipping}
            <div class="flex gap-4">
              <Button on:click={handleUpdateShipping}>Save</Button>

              <Button variant="outline" on:click={handleUpdateShippingCancel}>Cancel</Button>
            </div>
          {:else}
            <Button
              on:click={() => {
                edit_shipping = true;
              }}
            >
              Edit
            </Button>
          {/if}
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h2 class="text-xl font-semibold mb-4">Shipping Vendor</h2>

          <div class="mb-5">
            <Label for="title">Tracking ID</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.shipping.trackingId}
              disabled={!edit_shipping_vendor}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Tracking URL</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={order.shipping.trackingUrl}
              disabled={!edit_shipping_vendor}
            />
          </div>

          <div class="mb-5">
            <Label for="title">Shipping Price</Label>
            <Input
              type="number"
              placeholder="Name"
              bind:value={order.shipping.price}
              disabled={!edit_shipping_vendor}
            />
          </div>

          {#if edit_shipping_vendor}
            <div class="flex gap-4">
              <Button on:click={handleUpdateShipping}>Save</Button>

              <Button variant="outline" on:click={handleUpdateShippingCancel}>Cancel</Button>
            </div>
          {:else}
            <Button
              on:click={() => {
                edit_shipping_vendor = true;
              }}
            >
              Edit
            </Button>
          {/if}
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root class="lg:col-span-2">
      <Card.Content class="p-4">
        <Spinner {loading}>
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
                class=" col-span-4 border-b py-4 grid grid-cols-4 gap-4 cursor-pointer"
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
                        <Badge>
                          {attribute}
                        </Badge>
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
          </div></Spinner
        >
      </Card.Content>
    </Card.Root>
  </div>

  <Button on:click={handleSave}>Save</Button>
</div>
