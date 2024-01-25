<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Loading.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { getUser, updateUser } from "../../../helper/endpoints";
  import { token_store } from "../../../helper/store";

  let loading = true;
  let edit = false;

  let user = {
    username: "",
  };

  const initUser = async (user_id) => {
    loading = true;
    if (user_id !== "create") {
      const response = await httpClient(`${getUser}/${user_id}`,{
        token: $token_store,
      });
      if (response.status === 200) {
        user = response.data.user;
      }
    }
    loading = false;
  };

  const handleSave = async () => {
    await httpClient(updateUser, {
      method: "POST",
      body: user,
      token: $token_store,
    });
  };

  $: {
    initUser($page.params._id);
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">User</h1>
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
    <div
      class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <!-- <h3 class="text-normal font-semibold mb-2">user</h3> -->

      {#if loading === true}
        <Loading />
      {:else if loading === false}
        <div class="mb-5">
          <label
            for="username"
            class="block mb-2 text-sm font-medium text-gray-900">Username</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Username"
            bind:value={user.username}
            disabled={!edit}
          />
        </div>
        <div class="mb-5">
          <label
            for="countries"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Select an status</label
          >
          <select
            id="status"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={user.status}
            on:change={(e) => (user.status = e.target.value)}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div class="mb-5 ">
          <label
            for="role"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Role</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Role"
            value={user.role.name}
            disabled={!edit}
          />
        </div>
        <div class="flex gap-2">
          <div class="mb-5 grow">
            <label
              for="firstName"
              class="block mb-2 text-sm font-medium text-gray-900"
              >First name</label
            >
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="First name"
              bind:value={user.firstName}
              disabled={!edit}
            />
          </div>
          <div class="mb-5 grow">
            <label
              for="lastName"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Last name</label
            >
            <input
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Last name"
              bind:value={user.lastName}
              disabled={!edit}
            />
          </div>
        </div>
        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900">Email</label
          >
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Email"
            bind:value={user.email}
            disabled={!edit}
          />
        </div>
        <div class="mb-5 grid grid-cols-4 gap-4">
          {#each user.addresses as address}
            <div class="rounded-lg border border-gray-200 p-4">
              <div class="mb-5">
                <label
                  for="fullName"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Full Name</label
                >
                <input
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Full Name"
                  bind:value={address.fullName}
                  disabled={!edit}
                />
              </div>
              <div class="mb-5">
                <label
                  for="mobile"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Mobile</label
                >
                <input
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Mobile"
                  bind:value={address.mobile}
                  disabled={!edit}
                />
              </div>
              <div class="mb-5">
                <label
                  for="addressLine1"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Address Line 1</label
                >
                <input
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Address Line 1"
                  bind:value={address.addressLine1}
                  disabled={!edit}
                />
              </div>
              <div class="mb-5">
                <label
                  for="addressLine2"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Address Line 2</label
                >
                <input
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Address Line 2"
                  bind:value={address.addressLine2}
                  disabled={!edit}
                />
              </div>
              <div class="mb-5">
                <label
                  for="city"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >City</label
                >
                <input
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="City"
                  bind:value={address.city}
                  disabled={!edit}
                />
              </div>
              <div class="mb-5">
                <label
                  for="pincode"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Pincode</label
                >
                <input
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Pincode"
                  bind:value={address.pincode}
                  disabled={!edit}
                />
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <button
    type="button"
    class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
    on:click={handleSave}
    class:hidden={!edit}
  >
    Save</button
  >
</div>
