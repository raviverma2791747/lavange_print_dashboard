<script>
  //@ts-nocheck
  import { getUser } from "../../helper/endpoints";
  import { httpClient } from "../../helper/httpClient";
  import { token_store } from "../../helper/store";
  import { user_cache } from "../../helper/cache_store";
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "../svg/CloseIcon.svelte";
  import Spinner from "../Spinner.svelte";

  const dispatch = createEventDispatcher();

  export let id;
  export let edit;
  let loading = true;
  let user;

  const initUser = async (id) => {
    loading = true;
    if ($user_cache.has(id)) {
      user = $user_cache.get(id);
    } else {
      const response = await httpClient(`${getUser}/${id}`, {
        token: $token_store,
      });
      if (response.status === 200) {
        user = response.data.user;
      }
    }
    loading = false;
  };

  $: initUser(id);
</script>

<div
  class="rounded-full bg-purple-100 border inline-flex items-center text-sm border-purple-300 shadow p-2 gap-2 self-center"
>
  {#if loading}
    <Spinner />
  {:else}
    <span>{user.username}</span>
    <button
      disabled={!edit}
      on:click={() => {
        dispatch("remove", { user });
      }}
    >
      <CloseIcon class="h-4 w-4" />
    </button>
  {/if}
</div>
