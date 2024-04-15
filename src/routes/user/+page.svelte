<script>
  //@ts-nocheck
  import Loading from "../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import DataTable from "../../components/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchUser } from "../../helper/endpoints";
  import { token_store } from "../../helper/store";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import { getByValue } from "../../helper/utils";
  import { USER_STATUS } from "../../helper/constants";

  let users = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/user/${row.detail._id}`);
  };

  const initUsers = async () => {
    loading = true;
    const response = await httpClient(fetchUser, {
      token: $token_store,
    });
    if (response.status === 200) {
      users = response.data.users ?? [];
    }
    loading = false;
  };

  $: initUsers();
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Users</h1>
    <Button
      on:click={() => {
        goto("/user/create");
      }}
    >
      Add User</Button
    >
  </div>
  <Card.Root>
    <Card.Content class="p-4">
      <Loading {loading}>
        {#if users.length}
          <DataTable
            headers={[
              { accessor: "username", header: "Username" },
              {
                accessor: "status",
                header: "Status",
                cell: ({ value }) => getByValue(USER_STATUS, value),
              },
              {
                accessor: "updatedAt",
                header: "Modified",
                cell: ({ value }) => format(value, "yyyy-MM-dd HH:mm:ss"),
              },
            ]}
            data={users}
            on:rowClick={handleRowClick}
          ></DataTable>
        {:else}
          <div class="flex justify-center">
            <div>
              <div>No proucts to show!</div>
            </div>
          </div>
        {/if}
      </Loading>
    </Card.Content>
  </Card.Root>
</div>
