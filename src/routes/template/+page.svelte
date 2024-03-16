<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../components/Spinner.svelte";
  import DataTable from "../../components/DataTable/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { token_store } from "../../helper/store";
  import { fetchConfig } from "../../helper/endpoints";

  let configs = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/template/${row.detail.name}`);
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
    <h1 class="text-2xl font-bold">Templates</h1>
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
    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <Loading {loading}>
        {#if configs.length}
          <DataTable
            headers={[
              { key: "name", value: "Name" },
              { key: "status", value: "Status" },
              {
                key: "updatedAt",
                value: "Modified",
                display: (updatedAt) =>
                  format(updatedAt, "yyyy-MM-dd HH:mm:ss"),
              },
            ]}
            rows={configs.map((config) => {
              return { ...config, id: config._id };
            })}
            on:click:row={handleRowClick}
          >
            <!-- <div class="mb-5">
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Search"
              />
            </div> -->

            <svelte:fragment slot="cell" let:row let:cell>
              {#if cell.key === "status"}
                <span
                  class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                  >{cell.value}</span
                >
              {:else}
                {cell.display ? cell.display(cell.value, row) : cell.value}
              {/if}
            </svelte:fragment>
          </DataTable>
        {:else}
          <div class="flex justify-center">
            <div>
              <div>No templates to show!</div>
            </div>
          </div>
        {/if}
      </Loading>
    </div>
  </div>
</div>
