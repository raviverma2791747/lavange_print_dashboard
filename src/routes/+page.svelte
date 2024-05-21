<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { getStats } from "../helper/endpoints";
  import { httpClient } from "../helper/httpClient";
  import { token_store } from "../helper/store";
  import { format } from "date-fns";
  import * as Card from "$lib/components/ui/card";
  import { formatCurrency, formatDate } from "../helper/utils";
  import { DATE_TIME_FORMAT } from "../helper/constants";
  import Spinner from "../components/Spinner.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import { goto } from "$app/navigation";
  let loading = true;
  let stats = {
    users: 0,
    orders: 0,
    recentOrders: [],
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
  <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-xl font-semibold">
          Users {format(new Date(), "MMMM")}
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <Spinner {loading}>
          {stats.users}
        </Spinner>
      </Card.Content>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-xl font-semibold">
          Orders {format(new Date(), "MMMM")}
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <Spinner {loading}>
          {stats.orders}
        </Spinner>
      </Card.Content>
    </Card.Root>
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-xl font-semibold">
          Revenue {format(new Date(), "MMMM")}
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <Spinner {loading}>
          {formatCurrency(stats.revenue ?? 0)}
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title>Recent Sales</Card.Title>
        <Card.Description
          >You made {stats.orders} sales this month.</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <div class="space-y-8">
          {#each stats.recentOrders as order}
            <div
              class="flex items-center cursor-pointer"
              on:click={() => {
                goto(`/order/${order._id}`);
              }}
            >
              <Avatar.Root class="h-9 w-9">
                <Avatar.Fallback
                  >{getName(
                    order.user.firstName,
                    order.user.lastName
                  )}</Avatar.Fallback
                >
              </Avatar.Root>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">
                  {order.user.username}
                </p>
                <p class="text-sm text-muted-foreground">
                  {order.user.email}
                </p>
              </div>
              <div class="ml-auto font-medium">
                {formatCurrency(order.total)}
              </div>
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>

<style lang="postcss">
</style>
