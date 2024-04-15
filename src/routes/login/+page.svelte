<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { userLogin } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { token_store, user_info_store } from "../../helper/store";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import { PUBLIC_BRAND_NAME } from "$env/static/public";
  import { toastMessage } from "../../helper/utils";

  let user = {
    username: "",
    password: "",
  };

  const login = async () => {
    if(!user.username || !user.password) {
      toastMessage("Please provide username and password", "error");
      return
    }
    const response = await httpClient(userLogin, {
      method: "POST",
      payload: user,
    });

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      token_store.set(response.data.token);
      toastMessage("Logged in successfully");
    }
  };

  $: {
    if ($user_info_store) {
      goto("/");
    }
  }
</script>

<div class="flex flex-col gap-4 h-screen justify-center items-center">
  <div>
    <h1 class="text-3xl font-semibold">{PUBLIC_BRAND_NAME} Dashboard</h1>
  </div>
  <Card.Root class="w-96">
    <Card.Header>
      <Card.Title>Login</Card.Title>
      <!-- <Card.Description>Card Description</Card.Description> -->
    </Card.Header>
    <Card.Content>
      <div class="mb-5">
        <Label for="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Username"
          bind:value={user.username}
        />
      </div>
      <div class="mb-5">
        <Label for="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          bind:value={user.password}
        />
        <!-- <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900">Password</label
        > -->
        <!-- <input
          type="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Password"
          bind:value={user.password}
        /> -->
      </div>

      <Button on:click={login}>Login</Button>
    </Card.Content>
    <!-- <Card.Footer>
      <p>Card Footer</p>
    </Card.Footer> -->
  </Card.Root>
</div>
