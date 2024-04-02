<script lang="ts">
  import DashboardIcon from "./svg/DashboardIcon.svelte";
  import MenuIcon from "./svg/MenuIcon.svelte";
  import OrdersIcon from "./svg/OrdersIcon.svelte";
  import SellIcon from "./svg/SellIcon.svelte";

  export let sidebarOpen: Boolean;

  const navigationMenu = [
    {
      menuName: "Home",
      pages: [],
    },
    {
      menuName: "Orders",
      pages: [],
    },
    {
      menuName: "Products",
      pages: [
        {
          pageName: "All Products",
          link: "/product",
        },
        {
          pageName: "Inventory",
          link: "/inventory",
        },
      ],
    },
    {
      menuName: "Customers",
      pages: [],
    },
  ];

  const getIcon = (menuName: string) => {
    switch (menuName) {
      case "Home":
        return DashboardIcon;
      case "Products":
        return SellIcon;
      default:
        return MenuIcon;
    }
  };
</script>

<div
  class="py-4 h-100 rounded-none border-none transition-all duration-200 ease-in-out overflow-hidden"
  class:w-16={!sidebarOpen}
  class:w-48={sidebarOpen}
>
  <nav class="">
    <ul>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-start items-center gap-2" href="/">
          <DashboardIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Dashboard</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-start items-center gap-2" href="/template">
          <DashboardIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Templates</span></a
        >
      </li>

      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-start items-center gap-2" href="/announcement">
          <DashboardIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Announcement</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-start items-center gap-2" href="/tag">
          <DashboardIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Tag</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-start items-center gap-2" href="/category">
          <DashboardIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Category</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-star items-center gap-2" href="/order">
          <OrdersIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Orders</span></a
        >
      </li>

      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-star items-center gap-2" href="/product">
          <SellIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Products</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-star items-center gap-2" href="/collection">
          <SellIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Collections</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-star items-center gap-2" href="/user">
          <SellIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Users</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-star items-center gap-2" href="/role">
          <SellIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Roles</span></a
        >
      </li>
      <li
        class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
      >
        <a class="flex justify-star items-center gap-2" href="/image">
          <SellIcon class="text-gray-500 w-6 h-6" />
          <span class:hidden={!sidebarOpen}>Image</span></a
        >
      </li>
      <li
      class="px-4 py-2 hover:text-purple-500 hover:bg-gray-100 cursor-pointer"
    >
      <a class="flex justify-star items-center gap-2" href="/coupon">
        <SellIcon class="text-gray-500 w-6 h-6" />
        <span class:hidden={!sidebarOpen}>Coupon</span></a
      >
    </li>
    </ul>
  </nav>
</div>

<style>
</style>
