<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Spinner from "../../../components/Spinner.svelte";
  import { getFacet, updateFacet } from "../../../helper/endpoints";
  import { httpClient } from "../../../helper/httpClient";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Select from "$lib/components/ui/select";
  import { FACET_TYPE } from "../../../helper/constants";
  import { getByValue, toastMessage } from "../../../helper/utils";

  let facet = {
    name: "",
    displayName: "",
    type: FACET_TYPE.OTHER,
    options: [],
  };
  let edit;
  let loading;

  const handleAddFacetOption = () => {
    facet.options = [
      ...facet.options,
      {
        displayName: "",
        value: "",
      },
    ];
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateFacet, {
      method: "POST",
      payload: facet,
    });

    if (response.status === 200) {
      goto(`/facet/${response.data.facet.id}`, {
        replaceState: true,
      });
      toastMessage(
        `Facet ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
      edit = false;
    }

    loading = false;
  };

  const initFacet = async (id) => {
    loading = true;
    const response = await httpClient(`${getFacet}/${id}`);
    if (response.status === 200) {
      facet = response.data.facet;
    }
    loading = false;
  };

  $: {
    if ($page.params.id !== "create") {
      initFacet($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Facet</h1>
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <div class="mb-2">
            <label for="facets" class="block mb-2 text-sm font-medium"
              >Facets</label
            >

            <div class="flex flex-col gap-2 mb-2">
              <div class="border rounded-lg p-4">
                <div class="mb-2">
                  <div class="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Display Name"
                      bind:value={facet.displayName}
                      disabled={!edit}
                    />

                    <Input
                      type="text"
                      placeholder="Name"
                      bind:value={facet.name}
                      disabled={!edit}
                    />

                    <Select.Root
                      disabled={!edit}
                      id="type"
                      selected={{
                        value: facet.type,
                        label: getByValue(FACET_TYPE, facet.type),
                      }}
                      onSelectedChange={(v) => {
                        v && (facet.type = v.value);
                      }}
                    >
                      <Select.Trigger>
                        <Select.Value class="capitalize" placeholder="Status" />
                      </Select.Trigger>
                      <Select.Content>
                        {#each Object.entries(FACET_TYPE) as [key, value]}
                          <Select.Item {value} label={key} />
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>

                <div class="mb-2">
                  <div class="flex flex-col gap-2 mb-2">
                    {#each facet.options as option}
                      <div class="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Option Display Name"
                          bind:value={option.displayName}
                          disabled={!edit}
                        />

                        {#if facet.type === "color"}
                          <Input
                            disabled={!edit}
                            type="color"
                            bind:value={option.value}
                          />
                        {:else}
                          <Input
                            type="text"
                            placeholder="Option Value"
                            bind:value={option.value}
                            disabled={!edit}
                          />
                        {/if}

                        <Button variant="destructive" disabled={!edit}
                          >Remove</Button
                        >
                      </div>
                    {/each}
                  </div>
                </div>

                <Button
                  disabled={!edit}
                  on:click={() => handleAddFacetOption()}
                >
                  Add Options
                </Button>
              </div>
            </div>
          </div>

          {#if edit}
            <Button on:click={handleSave}>Save</Button>
          {:else}
            <Button
              on:click={() => {
                edit = true;
              }}
            >
              Edit
            </Button>
          {/if}
        </Spinner>
      </Card.Content>
    </Card.Root>
  </div>
</div>
