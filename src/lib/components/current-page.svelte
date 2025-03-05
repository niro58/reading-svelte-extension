<script lang="ts">
  import { ReadingStatus, type ReadingFolder, type Website } from "$lib/types";
  import { AlertCircle, BookOpen, Clock, Plus } from "lucide-svelte";
  import Button from "./ui/button/button.svelte";
  import * as Dialog from "./ui/dialog/index.js";
  import { Label } from "./ui/label";
  import { Input } from "./ui/input";
  import * as Select from "./ui/select/index";

  interface Props {
    folders: { [name: string]: ReadingFolder };
    websites: Website[];
    onAddWebsite: (website: Omit<Website, "id" | "created_at">) => void;
    onUpdateStatus: (websiteId: string, folderId: string) => void;
    onToggleUrgent: (websiteId: string, folderId: string) => void;
  }
  const {
    folders = $bindable(),
    websites = $bindable(),
    onAddWebsite,
    onUpdateStatus,
    onToggleUrgent,
  }: Props = $props();

  let currentUrl = $state("");
  let currentTitle = $state("");
  let selectedFolder = $state("");
  let currentWebsite = $state<Website | null>(null);

  $effect(() => {
    if (currentUrl) {
      const found = websites.find((w) => w.url === currentUrl);
      currentWebsite = found || null;
    }
  });
  const handleAddWebsite = () => {
    if (!selectedFolder || !currentUrl) return;

    onAddWebsite({
      title: currentTitle,
      url: currentUrl,
      status: ReadingStatus.TO_READ,
      favicon: "/placeholder.svg?height=16&width=16",

      folderName: selectedFolder,
    });
  };
</script>

<div class="py-4 border-b space-y-4">
  {#if currentWebsite}
    <div class="flex gap-2">
      <Button
        variant={currentWebsite.status === ReadingStatus.READ
          ? "secondary"
          : "default"}
        class="flex-1"
        onclick={() => {
          if (currentWebsite !== null) {
            // onUpdateStatus(currentWebsite.id, currentWebsite.folderId || "");
          }
        }}
      >
        {#if currentWebsite.status === ReadingStatus.READ || currentWebsite.status === ReadingStatus.URGENT}
          <Clock class="h-4 w-4 mr-2" />
          Mark as read
        {:else}
          <BookOpen class="h-4 w-4 mr-2" />
          Mark as To Read
        {/if}
      </Button>
      <Button
        variant={currentWebsite.status === ReadingStatus.URGENT
          ? "secondary"
          : "default"}
        class="flex-1"
        onclick={() => {
          if (currentWebsite !== null) {
            // onToggleUrgent(currentWebsite.id, currentWebsite.folderId || "");
          }
        }}
      >
        <AlertCircle class="h-4 w-4 mr-2" />
        {currentWebsite.status === ReadingStatus.URGENT
          ? "Remove Urgency"
          : "Mark as Urgent"}
      </Button>
    </div>
  {:else}
    <Dialog.Root>
      <Dialog.Trigger class="w-full">
        {#snippet children()}
          <Button class="w-full">
            <Plus class="h-4 w-4 mr-2" />
            Add Current Page
          </Button>
        {/snippet}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add to Reading List</Dialog.Title>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="title">Title</Label>
            <Input id="title" bind:value={currentTitle} />
          </div>
          <div class="grid gap-2">
            <Label for="folder">Folder</Label>
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
          </div>
        </div>
        <Dialog.Footer>
          <Dialog.Close>
            {#snippet children()}
              <Button variant="outline">Cancel</Button>
            {/snippet}
          </Dialog.Close>
          <Dialog.Close>
            <Button onclick={handleAddWebsite}>Add</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</div>
