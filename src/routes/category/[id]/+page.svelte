<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Spinner from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import {
    fetchFacet,
    getCategory,
    getFacet,
    updateCategory,
  } from "../../../helper/endpoints";
  import slug from "slug";
  import ImageView from "../../../components/ImageView.svelte";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import Autocomplete from "../../../components/Autocomplete.svelte";
  import FacetPill from "../../../components/Category/FacetPill.svelte";
  import { facet_cache } from "../../../helper/cache_store";
  import throttle from "lodash/throttle";
  import * as Card from "$lib/components/ui/card";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Select from "$lib/components/ui/select";
  import { getByValue, toastMessage } from "../../../helper/utils";
  import { STATUS } from "../../../helper/constants";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { goto } from "$app/navigation";
  import TagInput from "../../../components/TagInput.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import { X } from "lucide-svelte";

  let loading = true;
  let edit = false;
  let facet_input;
  let suggested_facets = [];

  let category = {
    name: "",
    facets: [],
    status: STATUS.DRAFT,
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateCategory, {
      method: "POST",
      token: $token_store,
      payload: category,
    });

    if (response.status === 200) {
      toastMessage(
        `Category ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
      goto(`/category/${response.data.category.id}`, {
        replaceState: true,
      });
      edit = false;
    }
    loading = false;
  };

  const initCategory = async (id) => {
    loading = true;
    const response = await httpClient(`${getCategory}/${id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      category = response.data.category ?? category;
    }
  };

  const handleSlug = () => {
    category.slug = slug(category.name);
  };

  const handleRemoveImage = async () => {
    category.asset = null;
  };

  const fetchFacets = async (search) => {
    if (search) {
      const response = await httpClient(fetchFacet, {
        params: { search },
        token: $token_store,
      });

      if (response.status === 200) {
        suggested_facets = response.data.facets ?? [];
      } else {
        suggested_facets = [];
      }

      suggested_facets.forEach((facet) => {
        if (!$facet_cache.has(facet._id)) {
          $facet_cache.set(facet._id, facet);
        }
      });
    }
  };
  // const throttledFetchFacets = throttle(fetchFacets, 1000, {
  //   leading: true,
  //   trailing: true,
  // });

  // $: {
  //   throttledFetchFacets(facet_input);
  // }

  const getFacetById = async (id) => {
    if ($facet_cache.has(id)) {
      return $facet_cache.get(id);
    } else {
      const response = await httpClient(`${getFacet}/${id}`, {
        token: $token_store,
      });
      if (response.status === 200) {
        let facet = response.data.facet ?? null;
        if (facet) {
          $facet_cache.set(facet._id, facet);
        }
        return facet;
      }
      return null;
    }
  };

  onMount(async () => {
    loading = true;
    if ($page.params._id !== "create") {
      await initCategory($page.params.id);
      await Promise.all(category.facets.map((facet) => getFacetById(facet)));
    } else {
      edit = true;
    }
    loading = false;
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-bold">Category</h1>
  </div>
  <div class="flex flex-col gap-4 mb-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Spinner {loading}>
          <div class="mb-4">
            <Label for="status">Status</Label>
            <Select.Root
              disabled={!edit}
              id="status"
              selected={{
                value: category.status,
                label: getByValue(STATUS, category.status),
              }}
              onSelectedChange={(v) => {
                v && (category.status = v.value);
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
            <Label for="title">Name</Label>
            <Input
              type="text"
              placeholder="Name"
              bind:value={category.name}
              disabled={!edit}
            />
          </div>

          <div class="mb-2">
            <Label>Slug</Label>
            <div class="flex gap-2">
              <Input
                type="text"
                placeholder="Slug"
                bind:value={category.slug}
                disabled={!edit}
              />

              <Button disabled={!edit} on:click={handleSlug}>Generate</Button>
            </div>
          </div>

          <div class="mb-5">
            <Label for="facets">Facets</Label>

            <TagInput tags={category.facets}>
              <svelte:fragment slot="tag" let:tag>
                <Badge class="text-base" variant="primary">
                  {$facet_cache.get(tag)?.displayName ?? tag}
                  <Button
                    size="icon"
                    variant="ghost"
                    on:click={() => {
                      category.facets = category.facets.filter(
                        (t) => t !== tag
                      );
                    }}
                  >
                    <X class="w-4 h-4" />
                  </Button>
                </Badge>
              </svelte:fragment>
              <svelte:fragment slot="input" let:search_input>
                <Autocomplete
                  class="border-0"
                  placeholder="Search Category"
                  search={search_input}
                  on:input={async (e) => {
                    await fetchFacets(e.detail.target.value);
                  }}
                  items={suggested_facets}
                  on:selected={(e) => {
                    if (category.facets.includes(e.detail.item._id)) {
                      return;
                    }
                    category.facets = [...category.facets, e.detail.item._id];
                  }}
                >
                  <svelte:fragment slot="item" let:item
                    >{item.name}</svelte:fragment
                  >
                </Autocomplete>
              </svelte:fragment>
            </TagInput>
          </div>

          <div class="mb-2">
            {#if category.asset}
              <div class="w-48 border">
                <ImageView
                  disabled={!edit}
                  id={category.asset}
                  on:delete={handleRemoveImage}
                />
              </div>
            {:else}
              <ImageUpload
                disabled={!edit}
                on:success={(e) => (category.asset = e.detail._id)}
              />
            {/if}
          </div>
        </Spinner>
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
