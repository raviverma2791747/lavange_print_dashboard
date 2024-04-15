<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import { getUser, updateUser } from "../../../helper/endpoints";
  import { token_store } from "../../../helper/store";
  import * as Card from "$lib/components/ui/card";
  import Spinner from "../../../components/Spinner.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/Input/Input.svelte";
  import * as Select from "$lib/components/ui/select";
  import { getByValue, toastMessage } from "../../../helper/utils";
  import { USER_STATUS } from "../../../helper/constants";
  import Button from "$lib/components/ui/button/button.svelte";

  let loading = true;
  let edit = false;

  let user = {
    username: "",
  };

  const initUser = async (user_id) => {
    loading = true;
    if (user_id !== "create") {
      const response = await httpClient(`${getUser}/${user_id}`, {
        token: $token_store,
      });
      if (response.status === 200) {
        user = response.data.user;
      }
    }
    loading = false;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateUser, {
      method: "POST",
      body: user,
      token: $token_store,
    });

    if (response.status === 200) {
      toastMessage(
        `User ${$page.params._id === "create" ? "created" : "updated"} successfully`
      );
      goto(`/user/${response.data.user._id}`, {
        replaceState: true,
      });
    }
    loading = false;
  };

  $: {
    initUser($page.params._id);
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">User</h1>
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <div class="mb-5">
            <Label for="username">Username</Label>
            <Input
              type="text"
              placeholder="Username"
              bind:value={user.username}
              disabled={!edit}
            />
          </div>
          <div class="mb-5">
            <Label for="status">Select an status</Label>
            <Select.Root
              disabled={!edit}
              id="status"
              selected={{
                value: user.status,
                label: getByValue(USER_STATUS, user.status),
              }}
              onSelectedChange={(v) => {
                v && (user.status = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(USER_STATUS) as [key, value]}
                  <Select.Item {value} label={key} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <div class="mb-5">
            <Label for="role">Role</Label>
            <Input
              type="text"
              placeholder="Role"
              value={user.role.name}
              disabled={!edit}
            />
          </div>
          <div class="flex gap-2">
            <div class="mb-5 grow">
              <Label for="firstName">First name</Label>
              <Input
                type="text"
                placeholder="First name"
                bind:value={user.firstName}
                disabled={!edit}
              />
            </div>
            <div class="mb-5 grow">
              <Label for="lastName">Last name</Label>
              <Input
                type="text"
                placeholder="Last name"
                bind:value={user.lastName}
                disabled={!edit}
              />
            </div>
          </div>
          <div class="mb-5">
            <Label for="email">Email</Label>
            <Input
              type="text"
              placeholder="Email"
              bind:value={user.email}
              disabled={!edit}
            />
          </div>
          <div class="mb-5 grid grid-cols-4 gap-4">
            {#each user.addresses as address}
              <div class="rounded-lg border p-4">
                <div class="mb-5">
                  <Label for="fullName">Full Name</Label>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    bind:value={address.fullName}
                    disabled={!edit}
                  />
                </div>
                <div class="mb-5">
                  <Label for="mobile">Mobile</Label>
                  <Input
                    type="text"
                    placeholder="Mobile"
                    bind:value={address.mobile}
                    disabled={!edit}
                  />
                </div>
                <div class="mb-5">
                  <Label for="addressLine1">Address Line 1</Label>
                  <Input
                    type="text"
                    placeholder="Address Line 1"
                    bind:value={address.addressLine1}
                    disabled={!edit}
                  />
                </div>
                <div class="mb-5">
                  <Label for="addressLine2">Address Line 2</Label>
                  <Input
                    type="text"
                    placeholder="Address Line 2"
                    bind:value={address.addressLine2}
                    disabled={!edit}
                  />
                </div>
                <div class="mb-5">
                  <Label for="city">City</Label>
                  <Input
                    type="text"
                    placeholder="City"
                    bind:value={address.city}
                    disabled={!edit}
                  />
                </div>
                <div class="mb-5">
                  <Label for="pincode">Pincode</Label>
                  <Input
                    type="text"
                    placeholder="Pincode"
                    bind:value={address.pincode}
                    disabled={!edit}
                  />
                </div>
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
      }}
    >
      Edit
    </Button>
  {/if}
</div>
