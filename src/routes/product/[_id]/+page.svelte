<script>
  //@ts-nocheck
  import { page } from "$app/stores";
  import { PUBLIC_API_URI } from "$env/static/public";
  import { onMount } from "svelte";
  import Loading from "../../../components/Loading.svelte";
  import { goto } from "$app/navigation";
  import { v4 as uuidv4 } from "uuid";
  import AddIcon from "../../../components/svg/AddIcon.svelte";
  import CloseIcon from "../../../components/svg/CloseIcon.svelte";
  import Autocomplete from "../../../components/Autocomplete.svelte";
  import lodash from "lodash";
  import VariantConfigs from "../../../components/Product/VariantConfigs.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { token_store } from "../../../helper/store";
  import {
    getProduct,
    updateProduct,
    fetchTag,
    fetchCategory,
    fetchCollection,
    updateImage,
  } from "../../../helper/endpoints";
  import Editor from "../../../components/Editor.svelte";

  const product_id = $page.params._id;
  let loading = true;
  let product = {
    title: "",
    description: "",
    price: 0,
    assets: [],
    trackQuantity: false,
    inventoryQuantity: 0,
    neverOutOfStock: false,
    hasSKU: false,
    sku: "",
    barcode: "",
    status: "draft",
    isDigitalProduct: false,
    shippingWeight: {
      value: 0,
      unit: "kg",
    },
    variantConfigs: [],
    tags: [],
    collections: [],
    category: "",
  };
  let product_ = product;
  let imageInput;
  let previewImages = [];
  let search_tag = "";
  let search_collection = "";
  let search_category = "";
  let tags = [];
  let collections = [];
  let categories = [];

  const imageUpload = async () => {
    const file = imageInput.files[0];

    if (file) {
      // const reader = new FileReader();
      // reader.addEventListener("load", function () {
      //   previewImages = [
      //     ...previewImages,
      //     {
      //       uploading: false,
      //       id: reader.result,
      //       url: reader.result,
      //     },
      //   ];
      // });

      let id = uuidv4();

      previewImages = [
        ...previewImages,
        {
          uploading: true,
          id: id,
          url: "",
        },
      ];

      // reader.readAsDataURL(file);

      let formData = new FormData();
      formData.append("img", file);

      const response = await httpClient(updateImage, {
        method: "POST",
        token: $token_store,
        formData: formData,
      });

      if (response.status === 200) {
        product.assets = [
          ...product.assets,
          {
            id: response.data.img.id,
            url: response.data.img.url,
          },
        ];

        const previewImageIndex = previewImages.findIndex(
          (previewImage_) => previewImage_.id === id
        );

        if (previewImageIndex !== -1) {
          previewImages = [
            ...previewImages.slice(0, previewImageIndex), // Copy elements before the target
            {
              ...previewImages[previewImageIndex], // Copy the target object with updates
              id: response.data.img.id,
              url: response.data.img.url,
              uploading: false,
            },
            ...previewImages.slice(previewImageIndex + 1), // Copy elements after the target
          ];
        }
      } else {
      }
    }
  };

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
        sku,
        attributes,
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
      price: 0,
      inventoryQuantity: 0,
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
      token: $token_store,
      payload: product,
    });
    if (response.status === 200) {
      if (product_id === "create") {
        goto(`/product/${response.data.product.id}`);
      }
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

  // const handleGenerateVariant = () => {
  //   product.variants = generateVariants(product.variantOptions) ?? [];
  // };

  const searchTag = async (search) => {
    const response = await httpClient(fetchTag, {
      params: { search },
      token: $token_store,
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
      token: $token_store,
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
      token: $token_store,
    });
    if (response.status === 200) {
      categories = response.data.categories;
    } else {
      categories = [];
    }
  };

  // const createvariantConfigs = () => {
  //   return {
  //     status: "draft",
  //     variantOptions: [],
  //     variants: []
  //   };
  // };

  const addVariantsData = () => {
    product.variantConfigs = [
      ...product.variantConfigs,
      {
        status: "draft",
        variantOptions: [],
        variants: [],
      },
    ];
  };

  const initProduct = async () => {
    loading = true;
    const response = await httpClient(`${getProduct}/${product_id}`, {
      token: $token_store,
    });
    if (response.status === 200) {
      product = response.data.product;
    }
    loading = false;
  };

  onMount(async () => {

    if (product_id !== "create") {
      await initProduct();
      product_ = structuredClone(product);
      previewImages = [...product.assets];
    }
    loading = false;


  });

  $: {
    searchTag(search_tag);
  }

  $: {
    searchCollection(search_collection);
  }

  $: {
    searchCategory(search_category);
  }

  // $: {
  //   if (product_id === "create") {
  //     product.variants = generateVariants(product.variantOptions) ?? [];
  //   }
  // }
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2 flex justify-between">
    <h1 class="text-2xl font-semibold">Add Product</h1>
  </div>

  <Loading {loading}>
    <div class="grid grid-flow-row lg:grid-cols-3 gap-4 mb-3">
      <div
        class="col-span-2 block p-6 bg-white border border-gray-200 rounded-lg shadow"
      >
        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Title</label
          >
          <input
            type="text"
            id="title"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Product Title"
            bind:value={product.title}
          />
        </div>
        <div class="mb-5">
          <label
            for="description"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Description</label
          >
          <Editor bind:content={product.description} placeholder="Product Description" />
          <!-- <textarea
            id="description"
            rows="5"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Product Description"
            bind:value={product.description}
          /> -->
        </div>

        <div class="mb-5">
          <label
            for="description"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Specificationn</label
          >
          <Editor bind:content={product.specification} placeholder="Specification" />
          <!-- <textarea
            rows="5"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Specification"
            bind:value={product.specification}
          /> -->
        </div>
      </div>

      <div
        class="col-span-1 block shadow p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
      >
        <h3 class="text-normal font-semibold">Product Status</h3>
        <div>
          <label
            for="countries"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Select an option</label
          >
          <select
            id="status"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={product.status}
            on:change={(e) => (product.status = e.target.value)}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archive">Archive</option>
          </select>
        </div>
      </div>

      <div
        class="col-span-2 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
      >
        <h3 class="text-normal font-semibold mb-2">Media</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {#each previewImages as previewImage}
            <div
              class="object-cover border border-gray-200 rounded-lg relative"
            >
              <img
                class="h-auto max-w-full"
                src={previewImage.url}
                alt={previewImage.id}
              />
              {#if previewImage.uploading}
                <div
                  class="opacity-30 bg-gray-900 absolute w-full h-full bg-red top-0 left-0 flex justify-center items-center"
                >
                  <div>
                    <Loading />
                  </div>
                </div>
              {/if}
            </div>
          {/each}
          <div
            class="border border-dashed border-gray-200 rounded-lg h-48 w-48 flex justify-center items-center"
          >
            <div class="text-center">
              <label
                class="bg-purple-100 py-2 px-4 rounded-lg block text-sm text-purple-500 hover:bg-purple-300 cursor-pointer"
              >
                <input
                  type="file"
                  hidden
                  on:change={imageUpload}
                  bind:this={imageInput}
                />
                Add
              </label>

              <div class="text-sm text-gray-400">Images and Videos</div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="col-span-1 block p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
      >
        <h3 class="text-normal font-semibold mb-5">Organization</h3>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Product category</label
          >
          {#if product.category}
            <div class="relative">
              <input
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Product category"
                value={product.category.name}
                disabled
              />
              <button
                class="absolute right-0 top-0 bottom-0 mr-2"
                on:click={() => {
                  handleRemoveCategory();
                }}
              >
                <CloseIcon class="w-4 h-4" />
              </button>
            </div>
          {:else}
            <Autocomplete
              placeholder="Search Category"
              bind:search={search_category}
              items={categories}
              on:selected={(e) => {
                handleAddCategory(e.detail.item);
              }}
            >
              <svelte:fragment slot="item" let:item>{item.name}</svelte:fragment
              >
            </Autocomplete>
          {/if}
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Collections</label
          >
          <Autocomplete
            placeholder="Search Collections"
            bind:search={search_collection}
            items={collections}
            on:selected={(e) => {
              handleAddCollection(e.detail.item);
            }}
          >
            <svelte:fragment slot="item" let:item>{item.name}</svelte:fragment>
          </Autocomplete>

          {#if product.collections.length > 0}
            <div class="flex">
              {#each product.collections as collection}
                <div
                  class="flex items-center bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full"
                >
                  <span>{collection.name} </span>
                  <button
                    on:click={() => {
                      handleRemoveCollection(collection);
                    }}><CloseIcon class="w-3 h-3" /></button
                  >
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <div class="mb-5">
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-900">Tags</label
          >
          <Autocomplete
            placeholder="Search Tags"
            bind:search={search_tag}
            items={tags}
            on:selected={(e) => {
              handleAddTag(e.detail.item);
            }}
          >
            <svelte:fragment slot="item" let:item>{item.name}</svelte:fragment>
          </Autocomplete>

          {#if product.tags.length > 0}
            <div class="flex">
              {#each product.tags as tag}
                <div
                  class="flex items-center bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full"
                >
                  <span>{tag.name} </span>
                  <button
                    on:click={() => {
                      handleRemoveTag(tag);
                    }}><CloseIcon class="w-3 h-3" /></button
                  >
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <div
        class="col-span-2 block shadow p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
      >
        <h3 class="text-normal font-semibold mb-5">Pricing</h3>

        <div class="mb-5">
          <label
            for="price"
            class="block mb-2 text-sm font-medium text-gray-900">Price</label
          >
          <input
            type="number"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="0.00"
            min="0"
            step=".01"
            bind:value={product.price}
          />
        </div>
      </div>

      <div
        class="col-span-2 p-6 shadow bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
      >
        <h3 class="text-normal font-semibold mb-5">Inventory</h3>

        <div class="flex flex-col divide-y gap-2">
          <div class="py-2">
            <div class="flex items-center" class:mb-2={product.trackQuantity}>
              <input
                type="checkbox"
                checked={product.trackQuantity}
                on:change={() => {
                  product.trackQuantity = !product.trackQuantity;
                }}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                for="default-checkbox"
                class="ms-2 text-sm font-medium text-gray-900"
                >Track Quantity</label
              >
            </div>
            {#if product.trackQuantity}
              <div>
                <label
                  for="trackQuantity"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Quantity</label
                >
                <input
                  type="number"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  placeholder="0"
                  min="0"
                  step="1"
                  bind:value={product.inventoryQuantity}
                />
              </div>
            {/if}
          </div>
          <div class="flex items-center py-2">
            <input
              type="checkbox"
              checked={product.neverOutOfStock}
              on:change={() => {
                product.neverOutOfStock = !product.neverOutOfStock;
              }}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              for="default-checkbox"
              class="ms-2 text-sm font-medium text-gray-900"
              >Continue selling when out of stock</label
            >
          </div>
          <div class="py-2">
            <div class="flex items-center" class:mb-2={product.hasSKU}>
              <input
                type="checkbox"
                checked={product.hasSKU}
                on:change={() => {
                  product.hasSKU = !product.hasSKU;
                }}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                for="default-checkbox"
                class="ms-2 text-sm font-medium text-gray-900"
                >This product has a SKU or Barcode</label
              >
            </div>

            {#if product.hasSKU}
              <div class="flex gap-2">
                <div>
                  <label
                    for="trackQuantity"
                    class="block mb-2 text-sm font-medium text-gray-900"
                    >SKU</label
                  >
                  <input
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    placeholder="SKU"
                    bind:value={product.sku}
                  />
                </div>

                <div>
                  <label
                    for="trackQuantity"
                    class="block mb-2 text-sm font-medium text-gray-900"
                    >Barcode (ISBN,UPC,GTIN etc)</label
                  >
                  <input
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    placeholder="Barcode"
                    bind:value={product.barcode}
                  />
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div
        class="col-span-2 block shadow p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-10"
      >
        <h3 class="text-normal font-semibold mb-4">Shipping</h3>

        <div
          class="flex flex-col gap-2 transition-all ease-in-out duration-200"
        >
          <div class="border border-gray-200 rounded-lg flex flex-col divide-y">
            <div
              class="p-4 flex items-center bg-gray-100"
              class:bg-gray-100={!product.isDigitalProduct}
            >
              <input
                id="default-radio-1"
                type="radio"
                bind:group={product.isDigitalProduct}
                value={false}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <label
                for="default-radio-1"
                class="ms-2 text-sm font-medium text-gray-900"
                >Physical product</label
              >
            </div>
            {#if !product.isDigitalProduct}
              <div class="p-4 flex items-end gap-2">
                <div class="">
                  <label
                    for="title"
                    class="block mb-2 text-sm font-medium text-gray-900"
                    >Shipping weight</label
                  >
                  <input
                    type="number"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    bind:value={product.shippingWeight.value}
                  />
                </div>
                <select
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={product.shippingWeight.unit}
                  on:change={(e) =>
                    (product.shippingWeight.unit = e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            {/if}
          </div>
          <div class="border border-gray-200 rounded-lg">
            <div class="p-4 flex items-center">
              <input
                id="default-radio-2"
                type="radio"
                value={true}
                bind:group={product.isDigitalProduct}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                for="default-radio-2"
                class="ms-2 text-sm font-medium text-gray-900"
                >Digital product or service</label
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="col-span-2 shadow block p-6 bg-white border border-gray-200 rounded-lg"
      >
        <h3 class="text-normal font-semibold mb-4">Variants</h3>
        <VariantConfigs bind:variantConfigs={product.variantConfigs} />
      </div>
    </div>

    <!-- <div
      class="col-span-2 block py-6 bg-white border border-gray-200 rounded-lg"
    >
      <h3 class="text-normal font-semibold mb-4 px-6">Search engine listing</h3>

      <p>
        To be done
      </p>
    </div> -->

    <button
      type="button"
      class="text-center inline-flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      on:click={handleSave}
    >
      Save</button
    >
  </Loading>
</div>


