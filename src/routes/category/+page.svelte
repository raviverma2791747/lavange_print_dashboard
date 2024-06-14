<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import Loading from "../../components/Spinner.svelte";
  import { httpClient } from "../../helper/httpClient";
  import { fetchCategory } from "../../helper/endpoints";
  import { formatDate, getByValue } from "../../helper/utils";
  import { DATE_TIME_FORMAT, STATUS } from "../../helper/constants";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import DataTable from "../../components/DataTable.svelte";

  let categories = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/category/${row.detail._id}`);
  };

  const initCategories = async () => {
    loading = true;
    const response = await httpClient(fetchCategory);
    if (response.status === 200) {
      categories = response.data.categories ?? [];
    }
    loading = false;
  };

  $: {
    initCategories();
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Categories</h1>
    <Button
      on:click={() => {
        goto("/category/create");
      }}
    >
      Add Category</Button
    >
  </div>
  <div class="flex flex-col gap-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          {#if categories.length}
            <DataTable
              headers={[
                { accessor: "name", header: "Title" },
                {
                  accessor: "status",
                  header: "Status",
                  cell: ({ value }) => getByValue(STATUS, value),
                },
                {
                  accessor: "updatedAt",
                  header: "Modified",
                  cell: ({ value }) => formatDate(value, DATE_TIME_FORMAT),
                },
              ]}
              data={categories}
              on:rowClick={handleRowClick}
            />
          {:else}
            <div class="flex justify-center">
              <div>
                <div>No categories to show!</div>
              </div>
            </div>
          {/if}
        </Loading>
      </Card.Content>
    </Card.Root>
  </div>
</div>
