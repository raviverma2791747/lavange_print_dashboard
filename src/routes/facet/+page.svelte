<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import Loading from "../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import DataTable from "../../components/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchFacet } from "../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";

  let facets = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/facet/${row.detail._id}`);
  };

  const initFacets = async () => {
    const response = await httpClient(fetchFacet);
    if (response.status === 200) {
      facets = response.data.facets ?? [];
    }
    loading = false;
  };

  onMount(async () => {
    await initFacets();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex gap-4 justify-between">
    <h1 class="text-2xl font-bold">Facets</h1>

    <Button
      on:click={() => {
        goto("/facet/create");
      }}
    >
      Add Facet</Button
    >
  </div>
  <Card.Root>
    <Card.Content class="p-4">
      <Loading {loading}>
        {#if facets.length}
          <DataTable
            headers={[
              { accessor: "name", header: "Name" },
              {
                accessor: "updatedAt",
                header: "Modified",
                cell: ({ value }) => format(value, "yyyy-MM-dd HH:mm:ss"),
              },
            ]}
            data={facets}
            on:rowClick={handleRowClick}
          />
        {:else}
          <div class="flex justify-center">
            <div>No facets to show!</div>
          </div>
        {/if}
      </Loading>
    </Card.Content>
  </Card.Root>
</div>
