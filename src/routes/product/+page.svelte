<script>
  //@ts-nocheck
  import Loading from "../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchProduct } from "../../helper/endpoints";
  import { token_store } from "../../helper/store";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import DataTable from "../../components/DataTable.svelte";
  import { getByValue } from "../../helper/utils";
  import { STATUS } from "../../helper/constants";

  let products = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/product/${row.detail._id}`);
  };

  const initProducts = async () => {
    loading = true;
    const response = await httpClient(fetchProduct, {
      token: $token_store,
    });

    if (response.status === 200) {
      products = response.data.products;
    }
    loading = false;
  };

  $: initProducts();
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Products</h1>
    <Button
      on:click={() => {
        goto("/product/create");
      }}
    >
      Add Product</Button
    >
  </div>
  <Card.Root>
    <Card.Content class="p-4">
      <Loading {loading}>
        {#if products.length}
          <DataTable
            headers={[
              { accessor: "title", header: "Title" },
              {
                accessor: "status",
                header: "Status",
                cell: ({ value }) => getByValue(STATUS, value),
              },
              {
                accessor: "updatedAt",
                header: "Modified",
                cell: ({ value }) => format(value, "yyyy-MM-dd HH:mm:ss"),
              },
            ]}
            on:rowClick={handleRowClick}
            data={products}
          />
        {:else}
          <div class="flex justify-center">
            <div>
              <div>No proucts to show!</div>
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
