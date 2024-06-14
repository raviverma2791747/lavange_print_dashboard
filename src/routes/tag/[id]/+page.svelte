<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { getTag, updateTag } from "../../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { toastMessage } from "../../../helper/utils";
  import { goto } from "$app/navigation";

  let loading = true;
  let edit = false;

  let tag = {
    name: "",
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateTag, {
      method: "POST",
      payload: tag,
    });

    if (response.status === 200) {
      toastMessage(
        `Tag ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
      goto(`/tag/${response.data.tag.id}`, {
        replaceState: true,
      });
      edit = false;
    }
    loading = false;
  };

  const initTag = async (id) => {
    loading = true;
    const response = await httpClient(`${getTag}/${id}`);
    if (response.status === 200) {
      tag = response.data.tag;
    }
    loading = false;
  };

  $: {
    if ($page.params.id !== "create") {
      initTag($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Tag</h1>
    <!-- <button
        type="button"
        class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
        on:click={() => {
          goto("/product/create");
        }}
      >
        Add Product</button
      > -->
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          <div class="mb-5">
            <Label for="title">Title</Label>
            <Input
              type="text"
              placeholder="Tag Name"
              bind:value={tag.name}
              disabled={!edit}
            />
          </div>
        </Loading>
      </Card.Content>
    </Card.Root>
    <!-- <h3 class="text-normal font-semibold mb-2">tag</h3> -->
  </div>

  {#if $page.params.id === "create"}
    <Button on:click={handleSave}>Save</Button>
  {/if}
</div>
