<script lang="ts">
  //@ts-nocheck
  import "../app.css";
  import Header from "../components/Header.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import { page } from "$app/stores";
  import {  user_info_store } from "../helper/store";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { httpClient } from "../helper/httpClient";
  import { userInfo } from "../helper/endpoints";
  import { browser } from "$app/environment";
  import Loading from "../components/Loading.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";

  let sidebarOpen = true;
  let initial_load = true;

  const toggleSidebar = () => {
    sidebarOpen = !sidebarOpen;
  };

  const initUserInfo = async () => {
    const response = await httpClient(userInfo, );

    if (response.status === 200) {
      user_info_store.set(response.data.user);
    } else {
     
      if (browser) {
        goto("/login");
      }
    }
  };

 

  user_info_store.subscribe((user) => {
    if (user) {
      if (browser) {
        if ($page.url.pathname === "/login") {
          goto("/");
        } else {
          goto($page.url.pathname);
        }
      }
    } else if (!initial_load) {
      if (browser) {
        goto("/login");
      }
    }
    initial_load = false;
  });

  onMount(async () => {
    await initUserInfo();
  });
</script>

<ModeWatcher />
<div class="flex flex-col min-h-screen">
  {#if $page.url.pathname === "/login"}
    <slot />
  {:else if $user_info_store}
    <Header />
    <div class="flex grow">
      <div
        class="h-[calc(100vh-64px)] top-[64px] border-r sticky left-0 hidden lg:block"
      >
        <Sidebar />
      </div>
      <div class="grow">
        <slot />
      </div>
    </div>
  {:else}
    <Loading />
  {/if}
</div>
<Toaster expand={true} richColors />
