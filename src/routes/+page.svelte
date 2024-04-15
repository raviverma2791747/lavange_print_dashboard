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
  <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  </div>
</div>

<style lang="postcss">
</style>
