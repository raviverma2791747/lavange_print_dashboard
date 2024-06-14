<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import { PUBLIC_API_URI } from "$env/static/public";
  import { onMount } from "svelte";
  import Spinner from "../../../components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import AddIcon from "../../../components/svg/AddIcon.svelte";
  import CloseIcon from "../../../components/svg/CloseIcon.svelte";
  import Autocomplete from "../../../components/Autocomplete.svelte";
  import lodash from "lodash";
  import VariantConfigs from "../../../components/Product/VariantConfigs.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import {
    getProduct,
    updateProduct,
    fetchTag,
    fetchCategory,
    fetchCollection,
  } from "../../../helper/endpoints";
  import Editor from "../../../components/Editor.svelte";
  import slug from "slug";
  import DeleteIcon from "../../../components/svg/DeleteIcon.svelte";
  import ImageUpload from "../../../components/ImageUpload.svelte";
  import ImageView from "../../../components/ImageView.svelte";
  import * as Card from "$lib/components/ui/card";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select";
  import { X } from "lucide-svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import { STATUS, WEIGHT_UNIT } from "../../../helper/constants";
  import { getByValue, toastMessage } from "../../../helper/utils";

  let edit = false;
  let loading = true;
  let product = {
    title: "",
    slug: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    assets: [],
    trackQuantity: false,
    inventoryQuantity: 0,
    neverOutOfStock: false,
    hasSKU: false,
    sku: "",
    barcode: "",
    status: STATUS.DRAFT,
    isDigitalProduct: false,
    shippingWeight: {
      value: 0,
      unit: WEIGHT_UNIT.KG,
    },
    variantConfigs: [],
    tags: [],
    collections: [],
    category: "",
  };
  let product_ = product;
  let search_tag = "";
  let search_collection = "";
  let search_category = "";
  let tags = [];
  let collections = [];
  let categories = [];

  const generateVariants = (variantOptions) => {
    if (variantOptions.length === 0) {
      return;
    }

    const variantAttributes = variantOptions.map((option) =>
      option.options.map((attr) => ({ [option.name]: attr.value }))
    );

    console.log(variantAttributes);

    function cartesianProduct(arr) {
      return arr.reduce(
        (a, b) => a.flatMap((x) => b.map((y) => Object.assign({}, x, y))),
        [{}]
      );
    }

    const allVariantsAttributes = cartesianProduct(variantAttributes);

    let variants_ = allVariantsAttributes.map((attributes) => {
      const sku = "";
      // `${product.title}-${Object.entries(attributes)
      //   .map(([key, value]) => `${key}-${value}`)
      //   .join("-")}`;

      //let old_variant = product_.variants.find(())
      let variant = {
        assets: [],
        sku,
        attributes,
        compareAtPrice: 0,
        price: 0, // Set the default price for the variant
        inventoryQuantity: 0, // Set the default inventory quantity for the variant
      };

      // const newAttributes = variantOptions.map((variantOption) => {
      //   return variantOption.name;
      // });

      // const oldAttributes = product_.variantOptions.map((variantOption) => {
      //   return variantOption.name;
      // });

      // console.log(newAttributes)
      // console.log(oldAttributes)

      //   const oldVariantAttributes = product_.variantOptions.map((option) =>
      //   option.options.map((attr) => ({ [option.name]: attr.value }))
      // );

      // console.log(variantAttributes)
      // console.log(oldVariantAttributes)

      // const oldSet = new Set(oldAttributes)
      // const newSet = new Set(newAttributes)

      // const commonSet  = new Set([...oldSet].filter(x => newSet.has(x)))

      // const commonAttributes = [...commonSet]

      return variant;
    });

    return variants_;
  };

  const createVariant = () => {
    return {
      sku: "",
      attributes: {},
      compareAtPrice: 0,
      price: 0,
      inventoryQuantity: 0,
      assets: [],
    };
  };

  const createVariants = (variantOptions) => {
    variantOptions.forEach((variantOption) => {
      variantOption.options.map((option) => {});
    });
  };

  const fillVariant = () => {};

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateProduct, {
      method: "POST",

      payload: product,
    });
    if (response.status === 200) {
      toastMessage(
        `Product ${$page.params.id === "create" ? "created" : "updated"} successfully`
      );
      goto(`/product/${response.data.product.id}`, {
        replaceState: true,
      });
      edit = false;
    }

    loading = false;
  };

  const handleAddTag = (tag_) => {
    const exist = product.tags.find((tag__) => tag__._id === tag_._id);
    if (!exist) {
      product.tags = [...product.tags, tag_];
    }
  };

  const handleRemoveTag = (tag_) => {
    let index = product.tags.findIndex((tag__) => tag__._id === tag_._id);

    if (index !== -1) {
      product.tags = [
        ...product.tags.slice(0, index),
        ...product.tags.slice(index + 1),
      ];
    }
  };

  const handleAddCollection = (collection_) => {
    const exist = product.collections.find(
      (collection__) => collection__._id === collection_._id
    );
    if (!exist) {
      product.collections = [...product.collections, collection_];
    }
  };

  const handleRemoveCollection = (collection_) => {
    let index = product.collections.findIndex(
      (collection__) => collection__._id === collection_._id
    );

    if (index !== -1) {
      product.collections = [
        ...product.collections.slice(0, index),
        ...product.collections.slice(index + 1),
      ];
    }
  };

  const handleAddCategory = (category_) => {
    product.category = category_;
  };

  const handleRemoveCategory = () => {
    product.category = null;
  };

  const handleCancelvariantConfigs = (e) => {
    if (!product.variantConfigs[e.detail.index]._id) {
      product.variantConfigs = [
        ...product.variantConfigs.slice(0, e.detail.index),
        ...product.variantConfigs.slice(e.detail.index + 1),
      ];
    }
  };

  const handleSlug = () => {
    product.slug = slug(product.title);
  };

  // const handleGenerateVariant = () => {
  //   product.variants = generateVariants(product.variantOptions) ?? [];
  // };

  const searchTag = async (search) => {
    const response = await httpClient(fetchTag, {
      params: { search },
    });
    if (response.status === 200) {
      tags = response.data.tags;
    } else {
      tags = [];
    }
  };

  const searchCollection = async (search) => {
    const response = await httpClient(fetchCollection, {
      params: { search },
    });
    if (response.status === 200) {
      collections = response.data.collections;
    } else {
      collections = [];
    }
  };

  const searchCategory = async (search) => {
    const response = await httpClient(fetchCategory, {
      params: { search },
    });
    if (response.status === 200) {
      categories = response.data.categories;
    } else {
      categories = [];
    }
  };

  const handleRemoveImage = (e) => {
    product.assets = product.assets.filter((asset) => {
      return asset !== e.detail.id;
    });
  };

  // const createvariantConfigs = () => {
  //   return {
  //     status: STATUS.DRAFT,
  //     variantOptions: [],
  //     variants: []
  //   };
  // };

  const addVariantsData = () => {
    product.variantConfigs = [
      ...product.variantConfigs,
      {
        status: STATUS.DRAFT,
        variantOptions: [],
        variants: [],
      },
    ];
  };

  const initProduct = async (id) => {
    loading = true;
    const response = await httpClient(`${getProduct}/${id}`);
    if (response.status === 200) {
      product = response.data.product;
      product_ = structuredClone(product);
    }
    loading = false;
  };

  $: {
    searchTag(search_tag);
  }

  $: {
    searchCollection(search_collection);
  }

  $: {
    searchCategory(search_category);
  }

  $: {
    if ($page.params.id !== "create") {
      initProduct($page.params.id);
    } else {
      loading = false;
      edit = true;
    }
  }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-semibold">Add Product</h1>
  </div>

  <div class="grid lg:grid-cols-3 gap-4 mb-3">
    <Card.Root class="lg:col-span-2">
      <Card.Content class="p-4">
        <Spinner {loading}>
          <div class="mb-5">
            <Label for="title">Title</Label>
            <Input
              disabled={!edit}
              type="text"
              id="title"
              placeholder="Product Title"
              bind:value={product.title}
            />
          </div>
          <div class="mb-5">
            <Label for="slug">Slug</Label>
            <div class="flex gap-2">
              <Input
                disabled={!edit}
                type="text"
                id="slug"
                placeholder="Product slug"
                bind:value={product.slug}
              />

              <Button disabled={!edit} on:click={handleSlug}>Generate</Button>
            </div>
          </div>
          <div class="mb-5">
            <Label for="description">Description</Label>
            <Editor
              disabled={!edit}
              bind:content={product.description}
              placeholder="Product Description"
            />
            <!-- <textarea
            id="description"
            rows="5"
            
            placeholder="Product Description"
            bind:value={product.description}
          /> -->
          </div>

          <div class="mb-5">
            <Label for="description">Specificationn</Label>
            <Editor
              disabled={!edit}
              bind:content={product.specification}
              placeholder="Specification"
            />
            <!-- <textarea
            rows="5"
            
            placeholder="Specification"
            bind:value={product.specification}
          /> -->
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <div class="lg:col-span-1 order-first lg:order-none">
      <Card.Root>
        <Card.Content class="p-4">
          <Spinner {loading}>
            <h3 class="text-normal font-semibold">Product Status</h3>
            <div>
              <Label for="status">Select an option</Label>

              <Select.Root
                disabled={!edit}
                id="status"
                selected={{
                  value: product.status,
                  label: getByValue(STATUS, product.status),
                }}
                onSelectedChange={(v) => {
                  v && (product.status = v.value);
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
          </Spinner>
        </Card.Content>
      </Card.Root>
    </div>

    <Card.Root class="lg:col-span-2">
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-2">Media</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {#each product.assets as asset}
              <ImageView
                disabled={!edit}
                id={asset}
                on:delete={handleRemoveImage}
              />
            {/each}

            <ImageUpload
              disabled={!edit}
              on:success={(e) => {
                product.assets = [...product.assets, e.detail._id];
              }}
            />
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <div class="lg:col-span-1">
      <Card.Root>
        <Card.Content class="p-4">
          <Spinner {loading}>
            <h3 class="text-normal font-semibold mb-5">Organization</h3>

            <div class="mb-5">
              <Label for="title">Product category</Label>
              {#if product.category}
                <div class="relative">
                  <Input
                    type="text"
                    placeholder="Product category"
                    value={product.category.name}
                    disabled
                  />
                  <Button
                    disabled={!edit}
                    class="absolute right-0 top-0 bottom-0 mr-2"
                    variant="ghost"
                    on:click={() => {
                      handleRemoveCategory();
                    }}
                  >
                    <X />
                  </Button>
                </div>
              {:else}
                <Autocomplete
                  disabled={!edit}
                  placeholder="Search Category"
                  bind:search={search_category}
                  items={categories}
                  on:selected={(e) => {
                    handleAddCategory(e.detail.item);
                  }}
                >
                  <svelte:fragment slot="item" let:item
                    >{item.name}</svelte:fragment
                  >
                </Autocomplete>
              {/if}
            </div>

            <div class="mb-5">
              <Label for="title">Collections</Label>
              <Autocomplete
                placeholder="Search Collections"
                bind:search={search_collection}
                items={collections}
                on:selected={(e) => {
                  handleAddCollection(e.detail.item);
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>

              {#if product.collections.length > 0}
                <div class="flex">
                  {#each product.collections as collection}
                    <Badge class="flex items-center justify-centerr">
                      <div>{collection.name}</div>
                      <button
                        disabled={!edit}
                        on:click={() => {
                          handleRemoveCollection(collection);
                        }}><X class="w-3 h-3" /></button
                      >
                    </Badge>
                  {/each}
                </div>
              {/if}
            </div>

            <div class="mb-5">
              <Label for="title">Tags</Label>
              <Autocomplete
                disabled={!edit}
                placeholder="Search Tags"
                bind:search={search_tag}
                items={tags}
                on:selected={(e) => {
                  handleAddTag(e.detail.item);
                }}
              >
                <svelte:fragment slot="item" let:item
                  >{item.name}</svelte:fragment
                >
              </Autocomplete>

              {#if product.tags.length > 0}
                <div class="flex">
                  {#each product.tags as tag}
                    <Badge class="flex items-center justify-centerr">
                      <div>{tag.name}</div>
                      <button
                        disabled={!edit}
                        on:click={() => {
                          handleRemoveTag(tag);
                        }}><X class="w-3 h-3" /></button
                      >
                    </Badge>
                  {/each}
                </div>
              {/if}
            </div>
          </Spinner>
        </Card.Content>
      </Card.Root>
    </div>

    <Card.Root class="lg:col-span-2">
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-5">Pricing</h3>

          <div class="mb-5">
            <Label for="price">Compare at Price</Label>
            <Input
              type="number"
              disabled={!edit}
              placeholder="0.00"
              min="0"
              step=".01"
              value={product.compareAtPrice}
              on:input={(e) => {
                product.compareAtPrice = e.target.value
                  ? Number(e.target.value)
                  : product.compareAtPrice;
              }}
            />
          </div>

          <div class="mb-5">
            <Label for="price">Price</Label>
            <Input
              disabled={!edit}
              type="number"
              placeholder="0.00"
              min="0"
              step=".01"
              value={product.price}
              on:input={(e) => {
                product.price = e.target.value
                  ? Number(e.target.value)
                  : product.price;
              }}
            />
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root class="lg:col-span-2">
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-5">Inventory</h3>

          <div class="flex flex-col divide-y gap-2">
            <div class="py-2">
              <div
                class="flex gap-2 items-center"
                class:mb-2={product.trackQuantity}
              >
                <Checkbox
                  bind:checked={product.trackQuantity}
                  disabled={!edit}
                />
                <Label for="default-checkbox">Track Quantity</Label>
              </div>
              {#if product.trackQuantity}
                <div>
                  <Label for="trackQuantity">Quantity</Label>
                  <Input
                    disabled={!edit}
                    type="number"
                    placeholder="0"
                    min="0"
                    step="1"
                    value={product.inventoryQuantity}
                    on:input={(e) => {
                      product.inventoryQuantity = e.target.value
                        ? Number(e.target.value)
                        : product.inventoryQuantity;
                    }}
                  />
                </div>
              {/if}
            </div>
            <div class="flex gap-2 items-center py-2">
              <Checkbox
                bind:checked={product.neverOutOfStock}
                disabled={!edit}
              />
              <Label for="default-checkbox"
                >Continue selling when out of stock</Label
              >
            </div>
            <div class="py-2">
              <div class="flex gap-2 items-center" class:mb-2={product.hasSKU}>
                <Checkbox bind:checked={product.hasSKU} disabled={!edit} />
                <Label for="default-checkbox"
                  >This product has a SKU or Barcode</Label
                >
              </div>

              {#if product.hasSKU}
                <div class="flex gap-2">
                  <div>
                    <Label for="trackQuantity">SKU</Label>
                    <Input
                      disabled={!edit}
                      type="text"
                      placeholder="SKU"
                      bind:value={product.sku}
                    />
                  </div>

                  <div>
                    <Label for="trackQuantity"
                      >Barcode (ISBN,UPC,GTIN etc)</Label
                    >
                    <Input
                      disabled={!edit}
                      type="text"
                      placeholder="Barcode"
                      bind:value={product.barcode}
                    />
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root class="lg:col-span-2">
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-4">Shipping</h3>

          <RadioGroup.Root
            value={product.isDigitalProduct ? "true" : "false"}
            onValueChange={(e) => {
              product.isDigitalProduct = e === "true" ? true : false;
            }}
          >
            <div
              class="flex flex-col gap-2 transition-all ease-in-out duration-200"
            >
              <div class="border rounded-lg flex flex-col divide-y">
                <div
                  class="p-4 flex items-center gap-2"
                  class:bg-base={!product.isDigitalProduct}
                >
                  <RadioGroup.Item
                    id="default-radio-1"
                    value="false"
                    disabled={!edit}
                  />
                  <Label for="default-radio-1">Physical product</Label>
                </div>
                {#if !product.isDigitalProduct}
                  <div class="p-4 flex items-end gap-2">
                    <div class="">
                      <Label for="title">Shipping weight</Label>
                      <Input
                        disabled={!edit}
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={product.shippingWeight.value}
                        on:input={(e) => {
                          product.shippingWeight.value = e.target.value
                            ? Number(e.target.value)
                            : product.shippingWeight.value;
                        }}
                      />
                    </div>

                    <Select.Root
                      disabled={!edit}
                      selected={{
                        value: product.shippingWeight.unit,
                        label: getByValue(
                          WEIGHT_UNIT,
                          product.shippingWeight.unit
                        ),
                      }}
                      onSelectedChange={(e) =>
                        (product.shippingWeight.unit = e.value)}
                    >
                      <Select.Trigger class="w-24">
                        <Select.Value placeholder="Unit" />
                      </Select.Trigger>
                      <Select.Content>
                        {#each Object.entries(WEIGHT_UNIT) as [key, value]}
                          <Select.Item {value} label={key} />
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>
                {/if}
              </div>
              <div class="border rounded-lg">
                <div class="p-4 flex gap-2 items-center">
                  <RadioGroup.Item
                    id="default-radio-2"
                    value="true"
                    disabled={!edit}
                  />
                  <Label for="default-radio-2">Digital product or service</Label
                  >
                </div>
              </div>
            </div>
          </RadioGroup.Root>
        </Spinner>
      </Card.Content>
    </Card.Root>

    <Card.Root class="lg:col-span-2">
      <Card.Content class="p-4">
        <Spinner {loading}>
          <h3 class="text-normal font-semibold mb-4">Variants</h3>
          <VariantConfigs
            disabled={!edit}
            bind:variantConfigs={product.variantConfigs}
          />
        </Spinner>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- <div
      class="col-span-2 block py-6 bg-white border border-gray-200 rounded-lg"
    >
      <h3 class="text-normal font-semibold mb-4 px-6">Search engine listing</h3>

      <p>
        To be done
      </p>
    </div> -->

  {#if edit}
    <Button type="Button" disabled={loading} on:click={handleSave}>Save</Button>
  {:else}
    <Button
      type="Button"
      on:click={() => {
        edit = true;
      }}>Edit</Button
    >
  {/if}
</div>
