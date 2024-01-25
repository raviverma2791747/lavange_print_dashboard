<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { userLogin } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { token_store, user_info_store } from "../../helper/store";

  let user = {
    username: "",
    password: "",
  };

  const login = async () => {
    const response = await httpClient(userLogin, {
      method: "POST",
      payload: user,
    });

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      token_store.set(response.data.token);
    }
  };

  onMount(async () => {
    if($user_info_store) {
      goto('/')
    }
  })
</script>

<div class="flex h-screen justify-center items-center">
  <div class=" bg-white border border-gray-200 rounded-xl shadow-sm w-80">
    <div class="p-4">
      <div class="text-center">
        <h1 class="block text-2xl font-bold text-gray-800">Login</h1>
      </div>
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
        />
      </div>
      <div class="mb-5">
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900">Password</label
        >
        <input
          type="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Password"
          bind:value={user.password}
        />
      </div>

      <button
        type="button"
        class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
        on:click={login}
      >
        Login</button
      >
    </div>
  </div>
</div>
