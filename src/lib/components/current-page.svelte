<script lang="ts">
  import { ReadingStatus, type Website } from "$lib/types";
  import { AlertCircle, Archive, BookOpen, Plus } from "lucide-svelte";
  import Button from "./ui/button/button.svelte";
  import { Label } from "./ui/label";
  import { Input } from "./ui/input";
  import * as Select from "./ui/select/index";
  import { onMount } from "svelte";
  import { getCurrentPage, type ChromePage } from "$lib/chrome";
  import CustomDialog from "./custom-dialog.svelte";
  import { getApp } from "$lib/app_controller.svelte";

  const app = getApp();

  let currentPage: ChromePage = $state({
    title: "",
    url: "",
  });
  let selectedFolder = $state("");
  let currentWebsite = $derived(app.findWebsite(currentPage.url));

  const handleAddWebsite = () => {
    if (!selectedFolder || !currentPage) return;

    app.addWebsite({
      title: currentPage.title,
      url: currentPage.url,
      status: ReadingStatus.TO_READ,
      favicon: currentPage.favicon || "/placeholder.svg?height=16&width=16",

      folderName: selectedFolder,
    });
    selectedFolder = "";
  };
  onMount(() => {
    getCurrentPage().then((res) => {
      if (res) {
        currentPage = res;
        console.log(currentPage)
      }
    });
  });
  $effect(()=>{
    console.log(currentWebsite)
  })
  // todo: bad choice by using maps, should use arrays
</script>

<div class="py-4 border-b space-y-4">
  {#if currentWebsite}
    <div class="flex flex-row justify-between items-center">
      <div class="text-lg font-semibold">Current Page</div>
      <div class="flex gap-2">
        <Button
          title="Mark as urgent"
          disabled={currentWebsite.status === ReadingStatus.URGENT}
          onclick={() => {
            if (currentWebsite) {
              app.updateWebsiteStatus(
                currentWebsite.folderName,
                currentWebsite.id,
                ReadingStatus.URGENT
              );

              currentWebsite!.status = ReadingStatus.URGENT;
            }
          }}
        >
          <AlertCircle class="h-4 w-4" />
        </Button>
        <Button
          title="Mark as read"
          variant="blue"
          disabled={currentWebsite.status === ReadingStatus.TO_READ}
          onclick={() => {
            if (currentWebsite) {
              app.updateWebsiteStatus(
                currentWebsite.folderName,
                currentWebsite.id,
                ReadingStatus.TO_READ
              );
              currentWebsite!.status = ReadingStatus.TO_READ;
            }
          }}
        >
          <BookOpen class="h-4 w-4" />
        </Button>
        <Button
          title="Archive"
          class="flex items-center"
          variant="green"
          disabled={currentWebsite.status === ReadingStatus.ARCHIVED}
          onclick={() => {
            if (currentWebsite) {
              app.updateWebsiteStatus(
                currentWebsite.folderName,
                currentWebsite.id,
                ReadingStatus.ARCHIVED
              );
              currentWebsite!.status = ReadingStatus.ARCHIVED;
            }
          }}
        >
          <Archive class="h-4 w-4" />
        </Button>
      </div>
    </div>
  {:else}
    <CustomDialog title="Add to Reading List" onAccept={handleAddWebsite}>
      {#snippet trigger()}
        <Button class="w-full">
          <Plus class="h-4 w-4 mr-2" />
          Add Current Page
        </Button>
      {/snippet}
      {#snippet body()}
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="title">Title</Label>
            <Input id="title" bind:value={currentPage.title} />
          </div>
          <div class="grid gap-2">
            <Label for="folder">Folder</Label>
            <div class="flex flex-row gap-2">
              <Select.Root type="single" bind:value={selectedFolder}>
                <Select.Trigger
                  >{selectedFolder || "Select a folder"}</Select.Trigger
                >
                <Select.Content class="max-h-[150px]">
                  {#each app.folders as [name]}
                    <Select.Item value={name}>
                      {name}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <Input
                bind:value={selectedFolder}
                placeholder="New folder name"
              />
            </div>
          </div>
        </div>
      {/snippet}
    </CustomDialog>
  {/if}
</div>
