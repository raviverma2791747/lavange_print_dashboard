<script>
  //@ts-nocheck
  import { ADDRESS_TYPE, STATUS } from "../../helper/constants";
  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import { getByValue, toastMessage } from "../../helper/utils";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { createEventDispatcher } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  const dispatch = createEventDispatcher();

  let loading = true;
  export let edit = false;

  let address = {
    status: STATUS.DRAFT,
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    mobile: "",
    pincode: "",
    country: "India",
    type: ADDRESS_TYPE.HOME,
  };

  const validate = (data) => {
    if (!data.fullName) {
      toastMessage("Please enter full name", "error");
      return false;
    }
    if (!data.mobile) {
      toastMessage("Please enter mobile", "error");
      return false;
    }
    if (!data.addressLine1) {
      toastMessage("Please enter address line 1", "error");
      return false;
    }
    if (!data.addressLine2) {
      toastMessage("Please enter address line 2", "error");
      return false;
    }
    if (!data.city) {
      toastMessage("Please enter city", "error");
      return false;
    }
    if (!data.pincode) {
      toastMessage("Please enter pincode", "error");
      return false;
    }

    if (!data.country) {
      toastMessage("Please enter country", "error");
      return false;
    }

    if (!data.type) {
      toastMessage("Please enter type", "error");
      return false;
    }

    if (!data.status) {
      toastMessage("Please enter status", "error");
      return false;
    }

    if (!data.state) {
      toastMessage("Please enter state", "error");
      return false;
    }

    return true;
  };
</script>

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

    <div class="flex gap-2">
      <Button
        disabled={!edit}
        class="grow"
        on:click={() => {
          if (validate(address)) {
            dispatch("add", { address });
          }
        }}>Add</Button
      >

      <Button
        disabled={!edit}
        class="grow"
        variant="outline"
        on:click={() => {
          dispatch("cancel");
        }}>Cancel</Button
      >
    </div>
  </Card.Content>
</Card.Root>
