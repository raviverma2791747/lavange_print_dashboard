<script>
  //@ts-nocheck
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DataTableActions from "./DataTableActions.svelte";
  import { createEventDispatcher } from "svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import { addPagination } from "svelte-headless-table/plugins";

  const dispatch = createEventDispatcher()

  //   type Payment = {
  //     id: string;
  //     amount: number;
  //     status: "pending" | "processing" | "success" | "failed";
  //     email: string;
  //   };

  export let data = [
    {
      id: "m5gr84i9",
      amount: 316,
      status: "success",
      email: "ken99@yahoo.com",
    },
    // ...
  ];
  export let headers = [
    {
      accessor: "id",
      header: "ID",
    },
    {
      accessor: "status",
      header: "Status",
    },
    {
      accessor: "email",
      header: "Email",
    },
    {
      accessor: "amount",
      header: "Amount",
    },
    {
      accessor: ({ id }) => id,
      header: "",
    },
  ];

  const table = createTable(readable(data));

  const columns = table.createColumns(
    headers.map((header) => table.column(header))
  );

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<div class="rounded-md border">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                <Table.Head {...attrs}>
                  <Render of={cell.render()} />
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          
          <Table.Row on:click={() => dispatch('rowClick', row.original)} {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  {#if cell.id === "status"}
                     <Badge>
                      <Render of={cell.render()} /></Badge>
                  {:else}
                    <Render of={cell.render()} />
                  {/if}
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>

