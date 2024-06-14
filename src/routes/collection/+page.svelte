<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import Loading from "../../components/Spinner.svelte";
  import { httpClient } from "../../helper/httpClient";
  import { fetchCollection } from "../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTable from "../../components/DataTable.svelte";
  import { formatDate, getByValue } from "../../helper/utils";
  import { DATE_TIME_FORMAT, STATUS } from "../../helper/constants";

  let collections = [];
  let loading = true;
  let rows = [];

  const SORT = Object.freeze({
    NONE: 0,
    ASC: 1,
    DSC: 2,
  });

  let headers = [
    {
      name: "Name",
      sort: SORT.NONE,
    },
    {
      name: "Action",
      sort: SORT.NONE,
    },
  ];

  const filter = () => {};

  const initCollections = async () => {
    loading = true;
    const response = await httpClient(fetchCollection);
    if (response.status === 200) {
      collections = response.data.collections;
    }
    loading = false;
  };

  const handleRowClick = (row) => {
    goto(`/collection/${row.detail._id}`);
  };

  onMount(async () => {
    await initCollections();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Collections</h1>
    <Button
      on:click={() => {
        goto("/collection/create");
      }}
    >
      Add collection</Button
    >
  </div>
  <div class="flex flex-col gap-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          {#if collections.length}
            <DataTable
              headers={[
                { accessor: "name", header: "Name" },
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
              data={collections}
              on:rowClick={handleRowClick}
            />
          {:else}
            <div class="flex justify-center">
              <div>
                <div>No collections to show!</div>
              </div>
            </div>
          {/if}
        </Loading>
      </Card.Content>
    </Card.Root>
  </div>
</div>
