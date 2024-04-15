<script>
  //@ts-nocheck
  import Badge from "$lib/components/ui/badge/badge.svelte";
import { createEventDispatcher } from "svelte";


  const dispatch = createEventDispatcher();
</script>

<Badge>
  <slot />
</Badge>
