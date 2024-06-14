<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Spinner from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { fetchRight, getRole, updateRole } from "../../../helper/endpoints";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Card from "$lib/components/ui/card";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { toastMessage } from "../../../helper/utils";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { RIGHT_TYPE } from "../../../helper/constants";

  let loading = true;
  let edit = false;

  let role = {
    name: "",
    rights: [],
  };

  // const initRights = async () => {
  //   loading = true;
  //   const response = await httpClient(fetchRight, {
  //   });
  //   if (response.status === 200) {
  //     rights = response.data.rights;
  //   }
  // };

  const initRole = async (role_id) => {
    loading = true;
    if (role_id !== "create") {
      const response = await httpClient(`${getRole}/${role_id}`, );
      if (response.status === 200) {
        role = response.data.role;
      }
    }
    loading = false;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateRole, {
      method: "POST",
      payload: role,
     
    });
    if (response.status === 200) {
      toastMessage("Role updated successfully");
      goto("/role");
    }
    loading = false;
  };

  $: {
    if ($page.params._id !== "create") {
      //initRights();
      initRole($page.params._id);
    } else {
      //initRights();
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Role</h1>
    <!-- <button
            type="button"
            class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            on:click={() => {
              goto("/product/create");
            }}
          >
            Add Product</button
          > -->
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <!-- <h3 class="text-normal font-semibold mb-2">role</h3> -->
        <Spinner {loading}>
          <div class="mb-5">
            <Label for="name">name</Label>
            <Input
              type="text"
              placeholder="name"
              bind:value={role.name}
              disabled={!edit}
            />
          </div>
          <div class="mb-5 flex flex-col gap-2">
            {#each Object.entries(RIGHT_TYPE) as [right, value]}
              <div class="flex items-center gap-2">
                <Checkbox
                  checked={role.rights.includes(value)}
                  onCheckedChange={(v) => {
                    if (v) {
                      role.rights = [...role.rights, value];
                    } else {
                      role.rights = role.rights.filter((r) => r !== value);
                    }
                  }}
                  disabled={!edit}
                />
                <!-- <Input
                  type="checkbox"
                  id={right}
                  class="h-4 w-4"
                  bind:group={role.rights}
                  value={right}
                /> -->
                <Label for={right}>
                  {right.split("_").join(" ")}
                </Label>
              </div>
            {/each}
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>
  </div>

  {#if edit}
    <Button on:click={handleSave}>Save</Button>
  {:else}
    <Button
      on:click={() => {
        edit = true;
      }}>Edit</Button
    >
  {/if}
</div>
