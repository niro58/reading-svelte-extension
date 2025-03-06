<script lang="ts">
  import { ReadingStatus, type ReadingFolder, type Website } from "$lib/types";
  import { AlertCircle, Archive, BookOpen, Plus } from "lucide-svelte";
  import Button from "./ui/button/button.svelte";
  import { Label } from "./ui/label";
  import { Input } from "./ui/input";
  import * as Select from "./ui/select/index";
  import { onMount } from "svelte";
  import { getCurrentPage, type ChromePage } from "$lib/chrome";
  import CustomDialog from "./custom-dialog.svelte";

  interface Props {
    folders: { [name: string]: ReadingFolder };
    onAddWebsite: (website: Omit<Website, "id" | "created_at">) => void;
    onUpdateStatus: (
      folderName: string,
      websiteId: number,
      status: ReadingStatus
    ) => void;
    onToggleUrgent: (website: Website) => void;
  }
  const { folders, onAddWebsite, onUpdateStatus, onToggleUrgent }: Props =
    $props();

  let currentPage: ChromePage = $state({
    title: "",
    url: "",
  });
  let selectedFolder = $state("");
  let currentWebsite = $state<Website | null>(null);

  $effect(() => {
    if (currentPage) {
      const found = Object.values(folders)
        .flatMap((f) => f.websites)
        .find((w) => w.url === currentPage?.url);
      currentWebsite = found || null;
    }
  });
  const handleAddWebsite = () => {
    if (!selectedFolder || !currentPage) return;

    onAddWebsite({
      title: currentPage.title,
      url: currentPage.url,
      status: ReadingStatus.TO_READ,
      favicon: currentPage.favicon || "/placeholder.svg?height=16&width=16",

      folderName: selectedFolder,
    });
  };
  onMount(() => {
    getCurrentPage().then((res) => {
      if (res) {
        currentPage = res;
      }
    });
  });
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
              onUpdateStatus(
                currentWebsite.folderName,
                currentWebsite.id,
                ReadingStatus.URGENT
              );
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
              onUpdateStatus(
                currentWebsite.folderName,
                currentWebsite.id,
                ReadingStatus.TO_READ
              );
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
              onUpdateStatus(
                currentWebsite.folderName,
                currentWebsite.id,
                ReadingStatus.ARCHIVED
              );
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
                <Select.Content>
                  {#each Object.entries(folders) as [name]}
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
