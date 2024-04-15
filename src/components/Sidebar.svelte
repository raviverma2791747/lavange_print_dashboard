<script lang="ts">
  import DashboardIcon from "./svg/DashboardIcon.svelte";
  import MenuIcon from "./svg/MenuIcon.svelte";
  import OrdersIcon from "./svg/OrdersIcon.svelte";
  import SellIcon from "./svg/SellIcon.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

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


</script>

<div
  class="py-4 h-100 rounded-none border-none transition-all duration-200 ease-in-out overflow-hidden"
>
  <nav class="">
    <ul>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-start items-center gap-2" href="/">
          <span>Dashboard</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-start items-center gap-2" href="/page">
          <span>Pages</span></a
        >
      </li>

      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-start items-center gap-2" href="/announcement">
          <span>Announcement</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-start items-center gap-2" href="/tag">
          <span>Tag</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-start items-center gap-2" href="/category">
          <span>Category</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/order">
          <span>Orders</span></a
        >
      </li>

      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/product">
          <span>Products</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/collection">
          <span>Collections</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/user">
          <span>Users</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/role">
          <span>Roles</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/image">
          <span>Image</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/coupon">
          <span>Coupon</span></a
        >
      </li>
      <li class="px-4 py-2 cursor-pointer">
        <a class="flex justify-star items-center gap-2" href="/facet">
          <span>Facet</span></a
        >
      </li>
    </ul>
  </nav>
</div>


