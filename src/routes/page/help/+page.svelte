<script>
  //@ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Loading from "../../../components/Spinner.svelte";
  import { httpClient } from "../../../helper/httpClient";
  import { getHelpConfig, updateHelpConfig } from "../../../helper/endpoints";
  import * as Card from "$lib/components/ui/card";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CreateTopicForm from "../../../components/Page/Help/CreateTopicForm.svelte";
  import EditTopicForm from "../../../components/Page/Help/EditTopicForm.svelte";
  import Topic from "../../../components/Page/Help/Topic.svelte";
  import { toastMessage } from "../../../helper/utils";

  let loading = true;
  let create = false;
  let helpConfig = {
    topics: [],
  };
  let edit = false;
  let edit_topic_index = -1;

  const initHelpConfig = async () => {
    loading = true;
    const response = await httpClient(getHelpConfig);
    if (response.status === 200) {
      helpConfig = response.data.helpConfig;
    }
    loading = false;
  };

  const handleSave = async () => {
    loading = true;
    const response = await httpClient(updateHelpConfig, {
      method: "POST",
      payload: helpConfig,
    });

    if (response.status === 200) {
      toastMessage("Saved Successfully");
      edit_topic_index = -1;
      edit = false;
    }
    loading = false;
  };

  onMount(async () => {
    await initHelpConfig();
  });
</script>

<div class="py-4 px-8 max-w-7xl mx-auto">
  <div class="mb-2">
    <h1 class="text-2xl font-bold">Help Configuration</h1>
  </div>
  <div class="flex flex-col gap-4">
    <Card.Root>
      <Card.Content class="p-4">
        <Loading {loading}>
          <h3 class="text-normal font-semibold mb-5">Topics</h3>

          {#if helpConfig.topics.length}
            <div class="flex flex-col space-y-4 mb-4">
              {#each helpConfig.topics as topic, i}
                {#if edit_topic_index === i}
                  <EditTopicForm
                    {topic}
                    on:save={({ detail }) => {
                      helpConfig.topics[edit_topic_index] = detail.topic;
                      edit_topic_index = -1;
                    }}
                    on:cancel={() => (edit_topic_index = -1)}
                  />
                {:else}
                  <Topic
                    {topic}
                    key={i}
                    on:delete={({ detail }) => {
                      helpConfig.topics = helpConfig.topics.filter(
                        (_, index) => index !== detail.key
                      );
                    }}
                    on:edit={({ detail }) => {
                      edit_topic_index = detail.key;
                    }}
                    on:up={({ detail }) => {
                      const temp = helpConfig.topics[detail.key - 1];
                      helpConfig.topics[detail.key - 1] = helpConfig.topics[
                        detail.key
                      ];
                      helpConfig.topics[detail.key] = temp;
                    }}
                    on:down={({ detail }) => {
                      const temp = helpConfig.topics[detail.key + 1];
                      helpConfig.topics[detail.key + 1] = helpConfig.topics[
                        detail.key
                      ];
                      helpConfig.topics[detail.key] = temp;
                    }}
                    disabled={!edit || edit_topic_index > -1}
                    disableUp={i === 0}
                    disableDown={i === helpConfig.topics.length - 1}
                  />
                {/if}
              {/each}
            </div>
          {/if}
          {#if create}
            <CreateTopicForm
              on:save={({ detail }) => {
                helpConfig.topics = [...helpConfig.topics, detail.topic];
                create = false;
              }}
              on:cancel={() => {
                create = false;
              }}
            />
          {:else}
            <Button
              variant="link"
              on:click={() => {
                create = true;
              }}
              disabled={!edit}>Add Topic</Button
            >
          {/if}
        </Loading>
      </Card.Content>
      <Card.Footer>
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
      </Card.Footer>
    </Card.Root>
  </div>
</div>
