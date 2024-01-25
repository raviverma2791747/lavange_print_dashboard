<script lang="ts">
  //@ts-nocheck
  import type { MouseEventHandler } from "svelte/elements";
  import MenuIcon from "./svg/MenuIcon.svelte";
  import { token_store, user_info_store } from "../helper/store";

  export let sidebarOpen: Boolean;
  export let toggleSidebar: MouseEventHandler<HTMLButtonElement>;

  const handleLogout = () => {
    token_store.set(null);
    localStorage.removeItem("token");
  };
</script>

<header
  class="bg-white w-full border-b border-gray-200 sticky top-0 z-20 shadow"
>
  <nav class="flex items-center w-full mx-auto p-4 gap-2">
    <button id="menu-button" on:click={toggleSidebar}>
      <MenuIcon class="w-6 h-6 hover:text-purple-500" />
    </button>
    <div class="mr-auto">
      <a href="/">Lavange Print</a>
    </div>
    <button>
      {$user_info_store?.firstName ?? ""}
    </button>
    <button class="text-red-500" on:click={handleLogout}> Logout </button>
  </nav>
</header>
