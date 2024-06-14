<script>
  //@ts-nocheck
  import Loading from "../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchOrder } from "../../helper/endpoints";
  import { formatCurrency, getByValue } from "../../helper/utils";
  import * as Card from "$lib/components/ui/card";
  import DataTable from "../../components/DataTable.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ORDER_STATUS } from "../../helper/constants";
  import { addPagination } from "svelte-headless-table/plugins";

  let orders = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/order/${row.detail.id}`);
  };

  const initOrders = async () => {
    loading = true;
    const response = await httpClient(fetchOrder);

    if (response.status === 200) {
      orders = response.data.orders;
    }
    loading = false;
  };

  $: initOrders();
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Orders</h1>
    <Button
      on:click={() => {
        goto("/order/create");
      }}
    >
      Add Order</Button
    >
  </div>
  <Card.Root>
    <Card.Content class="p-4">
      <Loading {loading}>
        {#if orders.length}
          <DataTable
            headers={[
              { accessor: "_id", header: "Order #" },
              {
                accessor: "user",
                header: "Customer",
                cell: ({ value }) => value.username,
              },
              {
                accessor: "status",
                header: "Status",
                cell: ({ value }) => {
                  return getByValue(ORDER_STATUS, value);
                },
              },
              {
                accessor: "items",
                header: "total",
                cell: ({ value }) =>
                  formatCurrency(
                    value.reduce((acc, item) => acc + item.price, 0)
                  ),
              },
              {
                accessor: "updatedAt",
                header: "Modified",
                cell: ({ value }) => format(value, "yyyy-MM-dd HH:mm:ss"),
              },
            ]}
            data={orders
              .map((order) => {
                return { ...order, id: order._id };
              })
              .sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
              })}
            on:rowClick={handleRowClick}
          />
        {:else}
          <div class="flex justify-center">
            <div>
              <div>No orders to show!</div>
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
      </Loading>
    </Card.Content>
  </Card.Root>
</div>
