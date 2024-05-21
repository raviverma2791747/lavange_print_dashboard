<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import Loading from "../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import DataTable from "../../components/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchCoupon } from "../../helper/endpoints";
  import { token_store } from "../../helper/store";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import { formatCurrency, getByValue } from "../../helper/utils";
  import { NUMBER_TYPE, STATUS } from "../../helper/constants";

  let coupons = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/coupon/${row.detail._id}`);
  };

  const initCoupons = async () => {
    const response = await httpClient(fetchCoupon, {
      token: $token_store,
    });
    if (response.status === 200) {
      coupons = response.data.coupons ?? [];
    }
    loading = false;
  };

  onMount(async () => {
    await initCoupons();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex gap-4 justify-between">
    <h1 class="text-2xl font-bold">Coupons</h1>

    <Button
      on:click={() => {
        goto("/coupon/create");
      }}
    >
      Add Coupon</Button
    >
  </div>
  <Card.Root>
    <Card.Content class="p-4">
      <Loading {loading}>
        {#if coupons.length}
          <DataTable
            headers={[
              {
                accessor: "code",
                header: "Code",
                cell: ({ value }) => value.toUpperCase(),
              },
              {
                accessor: "status",
                header: "Status",
                cell: ({ value }) => {
                  return getByValue(STATUS, value);
                },
              },
              {
                accessor: "discount",
                header: "Discount",
                cell: ({ value }) =>
                  value.type === NUMBER_TYPE.PERCENTAGE
                    ? `${value.amount}%`
                    : formatCurrency(value.amount),
              },
              {
                accessor: "updatedAt",
                header: "Modified",
                cell: ({ value }) => format(value, "yyyy-MM-dd HH:mm:ss"),
              },
            ]}
            data={coupons}
            on:rowClick={handleRowClick}
          />
        {:else}
          <div class="flex justify-center">
            <div>
              <div>No coupons to show!</div>
            </div>
          </div>
        {/if}
      </Loading>
    </Card.Content>
  </Card.Root>
</div>
