<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { fetchConfig, getServerConfig, updateServerConfig } from "../../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let loading = true;
  let serverConfig;
  let edit = false;

  const initServerConfig = async () => {
    loading = true;
    const response = await httpClient(getServerConfig);
    if (response.status === 200) {
      serverConfig = response.data.serverConfig;
    }
    loading = false;
  };

  const handleSave = async () => {
    await httpClient(updateServerConfig, {
      method: "POST",
      payload: serverConfig,
    });
  };

  onMount(async () => {
    await initServerConfig();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Server Configuration</h1>
  </div>
  <div class="flex flex-col gap-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          <h3 class="text-normal font-semibold mb-5">Payment Gateway</h3>

          <div class="flex flex-col divide-y gap-2">
            {#each serverConfig.paymentGateways as paymentGateway}
              <div class="py-2">
                <div class="flex gap-2 items-center">
                  <Checkbox
                    bind:checked={paymentGateway.status}
                    disabled={!edit}
                  />
                  <Label for="default-checkbox">{paymentGateway.name}</Label>
                </div>
              </div>
            {/each}
          </div>
        </Loading>
      </Card.Content>
      <Card.Footer>
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
      </Card.Footer>
    </Card.Root>
  </div>
</div>
