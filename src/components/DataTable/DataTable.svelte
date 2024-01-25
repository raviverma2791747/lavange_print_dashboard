<script>
  //@ts-nocheck
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let rows = [];
  export let headers = [];
  export let stickyHeader = false;

  const resolvePath = (object, path) => {
    if (path in object) return object[path];
    return path
      .split(/[\.\[\]\'\"]/)
      .filter((p) => p)
      .reduce((o, p) => (o && typeof o === "object" ? o[p] : o), object);
  };

  $: headerKeys = headers.map(({ key }) => key);
  $: tableCellsByRowId = rows.reduce((rows, row) => {
    rows[row.id] = headerKeys.map((key, index) => ({
      key,
      value: resolvePath(row, key),
      display: headers[index].display,
    }));
    return rows;
  }, {});
</script>

<slot />
<div class="relative overflow-x-auto">
  <table
    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
  >
    <thead
      class="text-xs text-gray-700 uppercase bg-gray-50"
      class:sticky={stickyHeader}
      class:top-0={stickyHeader}
      on:click={({ target }) => {
        dispatch("click:header", { header });
      }}
    >
      <tr>
        {#each headers as header}
          <th scope="col" class="px-6 py-3">
            <slot name="cell-header" {header}>
              {header.value}
            </slot></th
          >
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (row.id)}
        <tr
          class="bg-white border-b cursor-pointer"
          on:click={({ target }) => {
            dispatch("click:row", row);
          }}
        >
          {#each tableCellsByRowId[row.id] as cell, j (cell.key)}
            <td
              class="px-6 py-4"
              on:click={({ target }) => {
                dispatch("click", { row, cell });
                dispatch("click:cell", cell);
              }}
            >
              <slot name="cell" {row} {cell} rowIndex={i} cellIndex={j}>
                {cell.display
                  ? cell.display(cell.value, row)
                  : cell.value}</slot
              >
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
