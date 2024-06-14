<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Loading from "../../components/Spinner.svelte";
  import { httpClient } from "../../helper/httpClient";
  import { fetchCategory, fetchTag } from "../../helper/endpoints";
  import { formatDate } from "../../helper/utils";
  import { DATE_TIME_FORMAT } from "../../helper/constants";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import DataTable from "../../components/DataTable.svelte";

  let tags = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/tag/${row.detail._id}`);
  };

  const initTags = async () => {
    loading = true;
    const response = await httpClient(fetchTag, );
    if (response.status === 200) {
      tags = response.data.tags ?? [];
    }
    loading = false;
  };

  $: initTags()
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Tags</h1>
    <Button
      on:click={() => {
        goto("/tag/create");
      }}
    >
      Add Tag</Button
    >
  </div>
  <div class="flex flex-col gap-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          {#if tags.length}
            <DataTable
              headers={[
                { accessor: "name", header: "Title" },

                {
                  accessor: "updatedAt",
                  header: "Modified",
                  cell: ({ value }) => formatDate(value, DATE_TIME_FORMAT),
                },
              ]}
              data={tags}
              on:rowClick={handleRowClick}
            />
          {:else}
            <div class="flex justify-center">
              <div>
                <div>No tags to show!</div>
              </div>
            </div>
          {/if}
        </Loading>
      </Card.Content>
    </Card.Root>
  </div>
</div>
