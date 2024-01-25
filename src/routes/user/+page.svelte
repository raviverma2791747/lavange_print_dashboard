<script>
  //@ts-nocheck
  import { PUBLIC_API_URI } from "$env/static/public";
  import { onMount } from "svelte";
  import Loading from "../../components/Loading.svelte";
  import { goto } from "$app/navigation";
  import AddIcon from "../../components/svg/AddIcon.svelte";
  import DataTable from "../../components/DataTable/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchUser } from "../../helper/endpoints";
  import { token_store } from "../../helper/store";

  let users = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/user/${row.detail.id}`);
  };

  const initUsers = async () => {
    const response = await httpClient(fetchUser,{
      token: $token_store,
    });
    if (response.status === 200) {
      users = response.data.users ?? [];
    }
    loading = false;
  };

  onMount(async () => {
    await initUsers();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">users</h1>
    <button
      type="button"
      class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      on:click={() => {
        goto("/user/create");
      }}
    >
      Add User</button
    >
  </div>
  <div class="bg-white w-full border border-gray-200 rounded-lg p-6 shadow">
    <Loading {loading}>
      {#if users.length}
        <DataTable
          headers={[
            { key: "username", value: "Username" },
            { key: "status", value: "Status" },
            {
              key: "updatedAt",
              value: "Modified",
              display: (updatedAt) => format(updatedAt, "yyyy-MM-dd HH:mm:ss"),
            },
          ]}
          rows={users.map((product) => {
            return { ...product, id: product._id };
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
  </div>
</div>
