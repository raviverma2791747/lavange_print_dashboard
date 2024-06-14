<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import Loading from "../../../../components/Spinner.svelte";
  import { httpClient } from "../../../../helper/httpClient";
  import { updatePolicy } from "../../../../helper/endpoints";
  import { getPolicy } from "../../../../helper/endpoints";
  import Editor from "../../../../components/Editor.svelte";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Select from "$lib/components/ui/select";
  import { STATUS } from "../../../../helper/constants";
  import { getByValue } from "../../../../helper/utils";
  import { page } from "$app/stores";

  let loading = true;
  let edit = false;

  let policy = {
    status: STATUS.DRAFT,
    name: "",
    description: "",
  };

  const handleSave = async () => {
    await httpClient(updatePolicy, {
      method: "POST",
      payload: policy,
    });
  };

  const initPolicy = async () => {
    loading = true;
    const response = await httpClient(`${getPolicy}/${$page.params.id}`);
    if (response.status === 200) {
      policy = response.data.policy ?? policy;
    }
    loading = false;
  };

  onMount(async () => {
    await initPolicy();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Policy</h1>
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content>
        <Loading {loading}>
          <div class="mb-4">
            <Label for="status">Status</Label>
            <Select.Root
              disabled={!edit}
              selected={{
                value: policy.status,
                label: getByValue(STATUS, policy.status),
              }}
              onSelectedChange={(e) => (policy.status = e.value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(STATUS) as [key, value]}
                  <Select.Item {value}>{key}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <div class="mb-5">
            <Label for="title">Name</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={policy.name}
              disabled
            />
          </div>

          <div class="mb-5">
            <label
              for="description"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Description</label
            >
            <Editor
              disabled={!edit}
              bind:content={policy.description}
              placeholder="Description"
            />
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
