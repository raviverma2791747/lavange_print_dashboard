<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import Loading from "../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import DataTable from "../../components/DataTable.svelte";
  import { format } from "date-fns";
  import { httpClient } from "../../helper/httpClient";
  import { fetchRole } from "../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";

  let roles = [];
  let loading = true;

  const handleRowClick = (row) => {
    goto(`/role/${row.detail._id}`);
  };

  const initRoles = async () => {
    const response = await httpClient(fetchRole);
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
    <Button
      on:click={() => {
        goto("/role/create");
      }}
    >
      Add Role</Button
    >
  </div>
  <Card.Root>
    <Card.Content class="p-4">
      <Loading {loading}>
        {#if roles.length}
          <DataTable
            headers={[
              { accessor: "name", header: "Name" },
              {
                accessor: "rights",
                header: "Rights",
                cell: ({ value }) => value.length,
              },
              {
                accessor: "updatedAt",
                header: "Modified",
                cell: ({ value }) => format(value, "yyyy-MM-dd HH:mm:ss"),
              },
            ]}
            data={roles}
            on:rowClick={handleRowClick}
          />
        {:else}
          <div class="flex justify-center">
            <div>
              <div>No roles to show!</div>
            </div>
          </div>
        {/if}
      </Loading>
    </Card.Content>
  </Card.Root>
</div>
