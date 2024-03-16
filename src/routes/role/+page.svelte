<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import Loading from "../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import DataTable from "../../components/DataTable/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchRole } from "../../helper/endpoints";
  import { token_store } from "../../helper/store";

  let roles = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/role/${row.detail.id}`);
  };

  const initRoles = async () => {
    const response = await httpClient(fetchRole, {
      token: $token_store,
    });
    if (response.status === 200) {
      roles = response.data.roles ?? [];
    }
    loading = false;
  };

  onMount(async () => {
    await initRoles();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Roles</h1>
    <button
      type="button"
      class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      on:click={() => {
        goto("/role/create");
      }}
    >
      Add Role</button
    >
  </div>
  <div class="bg-white w-full border border-gray-200 rounded-lg p-6 shadow">
    <Loading {loading}>
      {#if roles.length}
        <DataTable
          headers={[
            { key: "name", value: "Name" },
            {
              key: "rights",
              value: "Rights",
              display: (rights) => rights.length,
            },
            {
              key: "updatedAt",
              value: "Modified",
              display: (updatedAt) => format(updatedAt, "yyyy-MM-dd HH:mm:ss"),
            },
          ]}
          rows={roles.map((role) => {
            return { ...role, id: role._id };
          })}
          on:click:row={handleRowClick}
        >
          <div class="mb-5">
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Search"
            />
          </div>

          <!-- <svelte:fragment slot="cell-header" let:header>
              {#if header.key === "title"}
                ok
              {:else}
                {header.value}
              {/if}
            </svelte:fragment> -->

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
            <div>No roles to show!</div>
            <!-- <button
                type="button"
                class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                on:click={() => {
                  goto("/role/create");
                }}
              >
                Add Product</button
              > -->
            <div></div>
          </div>
        </div>
      {/if}
    </Loading>
  </div>
</div>
