<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import {
    getAnnouncement,
    updateAnnouncement,
  } from "../../../helper/endpoints";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import ImageView from "../../../components/ImageView.svelte";
  import { goto } from "$app/navigation";
  import { STATUS } from "../../../helper/constants";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select";
  import { getByValue, toastMessage } from "../../../helper/utils";
  import Input from "$lib/components/ui/input/input.svelte";

  let loading = true;
  let edit = false;
  let announcement = {
    title: "",
    status: STATUS.DRAFT,
    asset: "",
    ctaUrl: "",
  };

  const handleRemoveImage = () => {
    announcement.asset = null;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateAnnouncement, {
      method: "POST",
      payload: announcement,
    });

    if (response.status === 200) {
      toastMessage(
        `Announcement ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
      goto(`/announcement/${response.data.announcement.id}`, {
        replaceState: true,
      });
      edit = false;
    }
    loading = false;
  };

  const initAnnouncement = async (id) => {
    loading = true;
    const response = await httpClient(`${getAnnouncement}/${id}`);
    if (response.status === 200) {
      announcement = response.data.announcement;
    }
    loading = false;
  };

  $: {
    if ($page.params.id !== "create") {
      initAnnouncement($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Announcement</h1>
  </div>

  <Card.Root class="mb-2">
    <Card.Content class="p-4">
      <Loading {loading}>
        <div class="mb-5">
          <Label for="title">Title</Label>
          <Input
            id="title"
            type="text"
            disabled={!edit}
            placeholder="Annoucement Title"
            bind:value={announcement.title}
          />
        </div>
        <div class="mb-5">
          <Label for="countries">Select an status</Label>

          <Select.Root
            disabled={!edit}
            id="status"
            selected={{
              value: announcement.status,
              label: getByValue(STATUS, announcement.status),
            }}
            onSelectedChange={(v) => {
              v && (announcement.status = v.value);
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
          <Label for="catUrl">Url</Label>
          <Input
            id="catUrl"
            type="text"
            placeholder="Annoucement Url"
            disabled={!edit}
            bind:value={announcement.ctaUrl}
          />
        </div>

        {#if announcement.asset}
          <div class="max-w-64">
            <ImageView
              disabled={!edit}
              id={announcement.asset}
              on:delete={handleRemoveImage}
            />
          </div>
        {:else}
          <ImageUpload
            disabled={!edit}
            on:success={(e) => (announcement.asset = e.detail._id)}
          />
        {/if}
      </Loading>
    </Card.Content>
  </Card.Root>

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
