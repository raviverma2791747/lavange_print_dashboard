<script lang="ts">
  //@ts-nocheck
  import type { MouseEventHandler } from "svelte/elements";
  import MenuIcon from "./svg/MenuIcon.svelte";
  import { token_store, user_info_store } from "../helper/store";
  import BellIcon from "./svg/BellIcon.svelte";
  import { socket } from "../socket";
  import Button from "$lib/components/ui/button/button.svelte";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import Menu from "lucide-svelte/icons/menu";
  import { Bell } from "lucide-svelte";
  import { toggleMode } from "mode-watcher";
  import Sidebar from "./Sidebar.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { PUBLIC_BRAND_NAME } from "$env/static/public";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Popover from "$lib/components/ui/popover";
  import { goto } from "$app/navigation";

  export let sidebarOpen: Boolean;
  export let toggleSidebar: MouseEventHandler<HTMLButtonElement>;

  let name;

  const handleLogout = () => {
    token_store.set(null);
    localStorage.removeItem("token");
  };

  const handle = () => {
    console.log("hello");
    socket.emit("message", "hello");
  };

  const getName = (first_name, last_name) => {
    let name = "";
    if (first_name && first_name.length) {
      name = first_name.charAt(0).toUpperCase();
    }
    if (last_name && last_name.length) {
      name += last_name.charAt(0).toUpperCase();
    }
    return name;
  };

  $: name =
    getName($user_info_store?.firstName, $user_info_store?.lastName) ?? "User";
</script>

<header class="sticky bg-background top-0 z-[40] h-16 border-b">
  <nav class="flex items-center w-full mx-auto p-4 gap-2">
    <div class=" lg:hidden">
      <Sheet.Root>
        <Sheet.Trigger><Menu /></Sheet.Trigger>
        <Sheet.Content side="left">
          <Sidebar />
        </Sheet.Content>
      </Sheet.Root>
    </div>

    <div class="mr-auto">
      <a href="/">{PUBLIC_BRAND_NAME}</a>
    </div>
    <Popover.Root>
      <Popover.Trigger>
        <Bell class="h-[1.2rem] w-[1.2rem]" />
      </Popover.Trigger>
      <Popover.Content
        >Place content for the popover here.

        <Button
          variant="link"
          on:click={() => {
            goto("/notification");
          }}>View All Notifications</Button
        >
      </Popover.Content>
    </Popover.Root>

    <Button on:click={toggleMode} variant="ghost" size="icon">
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar.Root>
          <!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
          <Avatar.Fallback>{name}</Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <!-- <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Separator /> -->
          <DropdownMenu.Item
            on:click={() => goto(`/user/${$user_info_store?._id}`)}
            >Profile</DropdownMenu.Item
          >
          <DropdownMenu.Item on:click={handleLogout}>Logout</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </nav>
</header>
