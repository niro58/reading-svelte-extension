<script lang="ts">
  import {
    Folder,
    ChevronRight,
    ChevronDown,
    BookOpen,
    MoreHorizontal,
    Edit,
    Trash2,
    ChevronUp,
    AlertCircle,
    Book,
    Archive,
  } from "lucide-svelte";
  import { ReadingStatus, type ReadingFolder, type Website } from "../types";
  import { Badge } from "./ui/badge";
  import * as DropdownMenu from "./ui/dropdown-menu/index";
  import { Button } from "./ui/button";
  import CustomDialog from "./custom-dialog.svelte";
  import Input from "./ui/input/input.svelte";

  interface Props {
    name: string;
    folder: ReadingFolder;
    onToggleFolder: (folderName: string) => void;
    onToggleShowAll: (folderName: string) => void;
    onUpdateWebsiteStatus: (
      folderName: string,
      websiteId: number,
      status: ReadingStatus
    ) => void;
    onDeleteWebsite: (websiteId: number, folderName: string) => void;
    onDeleteFolder: (folderName: string) => void;
    onUpdateFolderName: (folderName: string, newName: string) => void;
  }
  const {
    name,
    folder,
    onToggleFolder,
    onToggleShowAll,
    onUpdateWebsiteStatus,
    onDeleteWebsite,
    onDeleteFolder,
    onUpdateFolderName,
  }: Props = $props();
  const countByStatus = (status: ReadingStatus) => {
    return folder.websites.filter((w) => w.status === status).length;
  };

  let newFolderName = $state("");
  let isOpenRenameDialog = $state(false);

  function filterWebsites(
    excludeState: ReadingStatus,
    limit?: number
  ): Website[] {
    return folder.websites
      .filter((w) => w.status !== excludeState)
      .slice(0, limit);
  }
</script>

{#snippet websiteItem(website: Website)}
  <div
    class="px-2 py-1 rounded-md flex items-center justify-between hover:bg-muted"
  >
    <div class="flex items-center overflow-hidden min-w-0 flex-1 gap-2">
      <Button
        variant="outline"
        size="icon"
        class="h-6 w-6 flex-shrink-0"
        onclick={() => {
          onDeleteWebsite(website.id, website.folderName);
        }}
      >
        <Trash2 class="h-4 w-4 text-red-500" />
      </Button>
      <img
        src={website.favicon || "/placeholder.svg"}
        alt=""
        class="h-4 w-4 mr-2 flex-shrink-0"
      />
      <span class="truncate text-sm">{website.title}</span>
    </div>
    <div class="flex items-center gap-1 ml-2">
      <Button
        variant="outline"
        size="icon"
        class="h-6 w-6 flex-shrink-0"
        onclick={() => {
          const status =
            website.status === ReadingStatus.TO_READ
              ? ReadingStatus.URGENT
              : ReadingStatus.TO_READ;

          onUpdateWebsiteStatus(website.folderName, website.id, status);
        }}
      >
        {#if website.status === ReadingStatus.TO_READ}
          <AlertCircle class="h-4 w-4 text-red-500" />
        {:else if website.status === ReadingStatus.URGENT}
          <Book class="h-4 w-4 text-blue-500" />
        {/if}
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-6 w-6 flex-shrink-0 border-green-500"
        onclick={() => {
          onUpdateWebsiteStatus(
            website.folderName,
            website.id,
            ReadingStatus.ARCHIVED
          );
        }}
      >
        <Archive class="h-4 w-4 text-green-500" />
      </Button>
    </div>
  </div>
{/snippet}
<div class="border rounded-md">
  <button
    class="py-2 px-2 flex items-center justify-between cursor-pointer hover:bg-muted w-full"
    onclick={() => onToggleFolder(name)}
  >
    <div class="flex items-center min-w-0 flex-1">
      {#if folder.expanded}
        <ChevronDown class="h-4 w-4 flex-shrink-0" />
      {:else}
        <ChevronRight class="h-4 w-4 flex-shrink-0" />
      {/if}
      <Folder class="h-4 w-4 mx-2 flex-shrink-0" />
      <span class="font-medium truncate">{name}</span>
    </div>
    <div class="flex items-center gap-2 ml-2">
      <div class="flex gap-1">
        <Badge variant="outline" class="text-xs">
          <AlertCircle class="h-3 w-3 mr-1 text-primary" />
          {countByStatus(ReadingStatus.URGENT)}
        </Badge>
        <Badge variant="outline" class="text-xs">
          <BookOpen class="h-3 w-3 mr-1 text-blue-500" />
          {countByStatus(ReadingStatus.TO_READ)}
        </Badge>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet children()}
            <Button variant="ghost" size="icon" class="h-6 w-6 flex-shrink-0">
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item onclick={() => (isOpenRenameDialog = true)}>
            <Edit class="h-4 w-4 mr-2" />
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onclick={() => onDeleteFolder(name)}
            class="text-destructive"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </button>
  {#if folder.expanded}
    {@const websites : Website[] = filterWebsites(ReadingStatus.ARCHIVED, folder.showAll ? undefined : 3)}
    <div class="py-1">
      {#if websites.length === 0}
        <div class="py-2 text-center text-sm text-muted-foreground">
          No websites in this folder
        </div>
      {:else}
        <div>
          {#each filterWebsites(ReadingStatus.ARCHIVED, folder.showAll ? undefined : 3) as website (website.id)}
            {@render websiteItem(website)}
          {/each}

          {#if folder.websites.length > 3}
            <Button
              variant="ghost"
              size="sm"
              class="w-full mt-1"
              onclick={() => onToggleShowAll(name)}
            >
              {#if folder.showAll}
                <div>
                  <ChevronUp class="h-4 w-4 mr-2" />
                  Show Less
                </div>
              {:else}
                <div>
                  <ChevronDown class="h-4 w-4 mr-2" />
                  Show All ({folder.websites.length})
                </div>
              {/if}
            </Button>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<CustomDialog
  title="New Folder Name"
  onAccept={() => {
    onUpdateFolderName(name, newFolderName);
  }}
  bind:isOpen={isOpenRenameDialog}
>
  {#snippet body()}
    <Input bind:value={newFolderName} />
  {/snippet}
</CustomDialog>
