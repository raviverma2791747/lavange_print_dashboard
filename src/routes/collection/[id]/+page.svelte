<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { getCollection, updateCollection } from "../../../helper/endpoints";
  import Editor from "../../../components/Editor.svelte";
  import slug from "slug";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import ImageView from "../../../components/ImageView.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import { getByValue, toastMessage } from "../../../helper/utils";
  import { STATUS } from "../../../helper/constants";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  let loading = true;
  let edit = false;

  let collection = {
    name: "",
    status: STATUS.DRAFT,
    asset: "",
    description: "",
    slug: "",
    products: [],
  };

  const handleRemoveImage = async () => {
    collection.asset = null;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateCollection, {
      method: "POST",
      payload: collection,
    });

    if (response.status === 200) {
      toastMessage(
        `Collection ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
      goto(`/collection/${response.data.collection.id}`, {
        replaceState: true,
      });
      edit = false;
    }

    loading = false;
  };

  const initCollection = async (id) => {
    loading = true;
    const response = await httpClient(`${getCollection}/${id}`);
    if (response.status === 200) {
      collection = response.data.collection;
    }
    loading = false;
  };

  const handleSlug = () => {
    collection.slug = slug(collection.name);
  };

  $: {
    if ($page.params.id !== "create") {
      initCollection($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Collection</h1>
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          <div class="mb-5">
            <Label for="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Title"
              bind:value={collection.name}
              disabled={!edit}
            />
          </div>

          <div class="mb-5">
            <Label for="status">Select a status</Label>
            <Select.Root
              id="status"
              disabled={!edit}
              selected={{
                value: collection.status,
                label: getByValue(STATUS, collection.status),
              }}
              onSelectedChange={(v) => {
                v && (collection.status = v.value);
              }}
            >
              <Select.Trigger>
                <Select.Value class="capitalize" placeholder="Status" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.entries(STATUS) as [key, value]}
                  <Select.Item {value} label={key} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="mb-5">
            <Label for="slug">Slug</Label>
            <div class="flex gap-2">
              <Input
                id="slug"
                type="text"
                placeholder="Slug"
                bind:value={collection.slug}
                disabled={!edit}
              />

              <Button disabled={!edit} on:click={handleSlug}>Generate</Button>
            </div>
          </div>

          <div class="mb-5">
            <Label for="description">Description</Label>
            <Editor
              disabled={!edit}
              bind:content={collection.description}
              placeholder="Description"
            />
          </div>

          <div>
            {#if collection.asset}
              <div class="w-48 border">
                <ImageView
                  disabled={!edit}
                  id={collection.asset}
                  on:delete={handleRemoveImage}
                />
              </div>
            {:else}
              <ImageUpload
                disabled={!edit}
                on:success={(e) => (collection.asset = e.detail._id)}
              />
            {/if}
          </div>
        </Loading>
      </Card.Content>
    </Card.Root>
  </div>

  {#if edit}
    <Button on:click={handleSave}>Save</Button>
  {:else}
    <Button
      on:click={() => {
        edit = true;
      }}
    >
      Edit
    </Button>
  {/if}
</div>
