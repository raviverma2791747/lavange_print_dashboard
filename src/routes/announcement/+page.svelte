<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import Loading from "../../components/Spinner.svelte";
  import { httpClient } from "../../helper/httpClient";
  import { fetchAnnouncement } from "../../helper/endpoints";
  import { formatDate, getByValue } from "../../helper/utils";
  import { DATE_TIME_FORMAT, STATUS } from "../../helper/constants";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import DataTable from "../../components/DataTable.svelte";

  let annoucements = [];
  let loading = true;

  const initAnnouncements = async () => {
    loading = true;
    const response = await httpClient(fetchAnnouncement, );
    if (response.status === 200) {
      annoucements = response.data.announcements ?? [];
    }
    loading = false;
  };

  const handleRowClick = (row) => {
    goto(`/announcement/${row.detail._id}`);
  };

  $: {
    initAnnouncements();
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Announcements</h1>
    <Button
      on:click={() => {
        goto("/announcement/create");
      }}
    >
      Add Announcement</Button
    >
  </div>
  <div class="flex flex-col gap-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          {#if annoucements.length}
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
                  cell: ({ value }) => formatDate(value, DATE_TIME_FORMAT),
                },
              ]}
              data={annoucements}
              on:rowClick={handleRowClick}
            />
          {:else}
            <div class="flex justify-center">
              <div>
                <div>No annoucement to show!</div>
              </div>
            </div>
          {/if}
        </Loading>
      </Card.Content>
    </Card.Root>
  </div>
</div>
