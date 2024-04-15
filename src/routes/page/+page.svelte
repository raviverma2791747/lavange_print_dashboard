<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../components/Spinner.svelte";
  import DataTable from "../../components/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { token_store } from "../../helper/store";
  import { fetchConfig } from "../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import { DATE_TIME_FORMAT, STATUS } from "../../helper/constants";
  import { getByValue } from "../../helper/utils";

  let configs = [];
  let loading = true;

  const handleRowClick = (row) => {
    if (row.detail.type === "policy") {
      goto(`/page/policy/${row.detail.name}`);
    } else {
      goto(`/page/${row.detail.name}`);
    }
  };

  const initConfigs = async () => {
    loading = true;
    const response = await httpClient(fetchConfig, {
      token: $token_store,
    });
    if (response.status === 200) {
      configs = response.data.configs;
    }
    loading = false;
  };

  onMount(async () => {
    await initConfigs();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Pages</h1>
    <!-- <button
      type="button"
      class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      on:click={() => {
        goto("/home/create");
      }}
    >
      Add Homepage Template</button
    > -->
  </div>
  <div class="flex flex-col gap-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          {#if configs.length}
            <DataTable
              headers={[
                {
                  accessor: "name",
                  header: "Name",
                  cell: ({ value }) => value.split("-").join(" "),
                },
                {
                  accessor: "status",
                  header: "Status",
                  cell: ({ value }) => getByValue(STATUS, value),
                },
                {
                  accessor: "updatedAt",
                  header: "Modified",
                  cell: ({ value }) => format(value, DATE_TIME_FORMAT),
                },
              ]}
              data={configs}
              on:rowClick={handleRowClick}
            />
          {:else}
            <div class="flex justify-center">
              <div>
                <div>No templates to show!</div>
              </div>
            </div>
          {/if}
        </Loading>
      </Card.Content>
    </Card.Root>
  </div>
</div>
