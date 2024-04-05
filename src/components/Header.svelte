<script lang="ts">
  //@ts-nocheck
  import type { MouseEventHandler } from "svelte/elements";
  import MenuIcon from "./svg/MenuIcon.svelte";
  import { token_store, user_info_store } from "../helper/store";
  import BellIcon from "./svg/BellIcon.svelte";
  import { socket } from "../socket";

  export let sidebarOpen: Boolean;
  export let toggleSidebar: MouseEventHandler<HTMLButtonElement>;

  const handleLogout = () => {
    token_store.set(null);
    localStorage.removeItem("token");
  };

  const handle = () => {
    console.log("hello");
    socket.emit("message", "hello");
  };

  
  
</script>

<header
  class="bg-white w-full border-b border-gray-200 sticky top-0 z-20 shadow h-16"
>
  <nav class="flex items-center w-full mx-auto p-4 gap-2">
    <button id="menu-button" on:click={toggleSidebar}>
      <MenuIcon class="w-6 h-6 hover:text-purple-500" />
    </button>
    <div class="mr-auto">
      <a href="/">Lavange Print</a>
    </div>
    <div>
      <a  href="/notification">
        <BellIcon class="w-6 h-6" />
      </a>
    </div>
    <button>
      {$user_info_store?.firstName ?? ""}
    </button>
    <button class="text-red-500" on:click={handleLogout}> Logout </button>
  </nav>
</header>
