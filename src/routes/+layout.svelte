<script lang="ts">
  //@ts-nocheck
  import "../app.css";
  import Header from "../components/Header.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import { page } from "$app/stores";
  import { token_store, user_info_store } from "../helper/store";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { httpClient } from "../helper/httpClient";
  import { userInfo } from "../helper/endpoints";
  import { browser } from "$app/environment";

  let sidebarOpen = true;

  const toggleSidebar = () => {
    sidebarOpen = !sidebarOpen;
  };

  const initUserInfo = async () => {
    const response = await httpClient(userInfo, {
      token: $token_store,
    });

    if (response.status === 200) {
      user_info_store.set(response.data.user);
    } else {
      token_store.set(null);
    }
  };

  token_store.subscribe((token) => {
    if (token) {
      initUserInfo();
    } else {
      user_info_store.set(null);
    }
  });

  user_info_store.subscribe((user) => {
    if (user) {
      if (browser) {
        goto("/");
      }
    } else {
      if (browser) {
        goto("/login");
      }
    }
  });

  onMount(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      token_store.set(token);
    } else {
      
    }
  });
</script>

<div class="flex flex-col min-h-screen">
  {#if $page.url.pathname === "/login"}
    <slot />
  {:else if $user_info_store}
    <Header {sidebarOpen} {toggleSidebar} />
    <div class="bg-gray-100 flex grow">
      <div
        class="sidebar-h bg-white border-r border-gray-200 sticky left-0 shadow"
      >
        <Sidebar {sidebarOpen} />
      </div>
      <div class=" grow transition-all duration-200 ease-in-out">
        <slot />
      </div>
    </div>
  {/if}
</div>

<style>
  .sidebar-h {
    top: 57px;
    height: calc(100vh - 57px);
  }
</style>
