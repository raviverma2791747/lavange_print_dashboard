<script>
  //@ts-nocheck
  import { notifications_store } from "../../helper/store";
</script>

<div>
  {#each $notifications_store as notification}
    <div>
      {notification}
    </div>
  {/each}
</div>
