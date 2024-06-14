<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import { httpClient } from "../../../helper/httpClient";
  import { fetchRole, getUser, updateUser } from "../../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Spinner from "../../../components/Spinner.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Select from "$lib/components/ui/select";
  import { getByValue, toastMessage } from "../../../helper/utils";
  import { ADDRESS_TYPE, STATUS, USER_STATUS } from "../../../helper/constants";
  import Button from "$lib/components/ui/button/button.svelte";
  import { goto } from "$app/navigation";
  import NewAddress from "../../../components/User/NewAddress.svelte";

  let loading = true;
  let edit = false;
  let new_address = false;

  let roles = [];

  let user = {
    country: "India",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: null,
    status: USER_STATUS.INACTIVE,
    addresses: [],
  };

  const initRoles = async () => {
    const response = await httpClient(fetchRole, {});
    if (response.status === 200) {
      roles = response.data.roles ?? [];
    }
  };

  const initUser = async (user_id) => {
    if (user_id !== "create") {
      const response = await httpClient(`${getUser}/${user_id}`, {});
      if (response.status === 200) {
        user = response.data.user;
      }
    } else {
      edit = true;
    }
  };

  const handleAddAddress = (e) => {
    user.addresses = [e.detail.address, ...user.addresses];
    new_address = false;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateUser, {
      method: "POST",
      payload: user,
    });

    if (response.status === 200) {
      toastMessage(
        `User ${$page.params._id === "create" ? "created" : "updated"} successfully`
      );
      goto(`/user/${response.data.user._id}`, {
        replaceState: true,
      });
      edit = false;
    }
    loading = false;
  };

  const init = async () => {
    loading = true;
    await initRoles();
    await initUser($page.params._id);
    loading = false;
  };

  $: {
    init();
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
            <Select.Root
              disabled={!edit}
              id="role"
              selected={{
                value: user.role,
                label: roles.find((role) => role._id === user.role)?.name,
              }}
              onSelectedChange={(v) => {
                v && (user.role = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Role" />
              </Select.Trigger>
              <Select.Content>
                {#each roles as role}
                  <Select.Item value={role._id} label={role.name} />
                {/each}
              </Select.Content>
            </Select.Root>
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
          <div class="mb-5 grid lg:grid-cols-4 gap-4">
            {#if new_address}
              <NewAddress
                {edit}
                on:cancel={() => (new_address = false)}
                on:add={handleAddAddress}
              />
            {:else}
              <Card.Root>
                <Card.Content class="p-4">
                  <Button disabled={!edit} on:click={() => (new_address = true)}
                    >New Address</Button
                  >
                </Card.Content>
              </Card.Root>
            {/if}
            {#each user.addresses as address}
              <Card.Root>
                <Card.Content class="p-4">
                  <div class="mb-5">
                    <Label for="status">Select an status</Label>
                    <Select.Root
                      disabled={!edit}
                      id="status"
                      selected={{
                        value: address.status,
                        label: getByValue(STATUS, address.status),
                      }}
                      onSelectedChange={(v) => {
                        v && (address.status = v.value);
                      }}
                    >
                      <Select.Trigger>
                        <Select.Value class="capitalize" placeholder="Status" />
                      </Select.Trigger>
                      <Select.Content>
                        {#each Object.entries(STATUS) as [key, value]}
                          <Select.Item {value} label={key} />
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>
                  <div class="mb-5">
                    <Label for="country">Country</Label>
                    <Input
                      type="text"
                      placeholder="Country"
                      bind:value={address.country}
                      disabled={true}
                    />
                  </div>
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
                    <Label for="type">Select type</Label>
                    <Select.Root
                      disabled={!edit}
                      selected={{
                        value: address.type,
                        label: getByValue(ADDRESS_TYPE, address.type),
                      }}
                      onSelectedChange={(v) => {
                        v && (address.type = v.value);
                      }}
                    >
                      <Select.Trigger>
                        <Select.Value class="capitalize" placeholder="Type" />
                      </Select.Trigger>
                      <Select.Content>
                        {#each Object.entries(ADDRESS_TYPE) as [key, value]}
                          <Select.Item {value} label={key} />
                        {/each}
                      </Select.Content>
                    </Select.Root>
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
                    <Label for="state">State</Label>
                    <Input
                      type="text"
                      placeholder="State"
                      bind:value={address.state}
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
                </Card.Content>
              </Card.Root>
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
