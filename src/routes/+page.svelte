<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { getStats } from "../helper/endpoints";
  import { httpClient } from "../helper/httpClient";
  import { token_store } from "../helper/store";
  import { format } from "date-fns";

  let loading = true;
  let stats = {
    users: 0,
    orders: 0,
  };

  const initStats = async () => {
    loading = true;
    const response = await httpClient(getStats, {
      token: $token_store,
    });
    if (response.status === 200) {
      stats = response.data;
    }
    loading = false;
  };

  onMount(async () => {
    await initStats();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="grid grid-cols-4 gap-4">
    <div
      class="block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h1 class="text-xl font-semibold">
        New Users {format(new Date(), "MMMM")}
      </h1>
      <div class="">{stats.users}</div>
    </div>
    <div
      class="block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
    >
      <h1 class="text-xl font-semibold">
        New Orders {format(new Date(), "MMMM")}
      </h1>
      <div class="">{stats.orders}</div>
    </div>
  </div>
</div>

<style lang="postcss">
</style>
