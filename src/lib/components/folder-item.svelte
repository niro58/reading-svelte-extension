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
  import { getApp } from "$lib/app_controller.svelte";
  import { cn } from "$lib/utils";

  interface Props {
    name: string;
    folder: ReadingFolder;
  }
  const { name, folder }: Props = $props();
  const countByStatus = (status: ReadingStatus) => {
    return folder.websites.filter((w) => w.status === status).length;
  };
  const websites = $derived(
    folder.websites.filter((w) => w.status !== ReadingStatus.ARCHIVED)
  );

  let newFolderName = $state("");
  let isOpenRenameDialog = $state(false);

  const app = getApp();
</script>

{#snippet websiteItem(website: Website)}
  <div
    class={cn(
      "px-2 py-1 rounded-md flex items-center justify-between hover:bg-muted",
      website.status === ReadingStatus.URGENT ? "bg-red-500/20" : ""
    )}
  >
    <div class="flex items-center overflow-hidden min-w-0 flex-1 gap-2">
      <Button
        variant="outline"
        size="icon"
        class="h-6 w-6 flex-shrink-0"
        onclick={() => {
          app.deleteWebsite(website.id, website.folderName);
        }}
      >
        <Trash2 class="h-4 w-4 text-red-500" />
      </Button>
      <a
        href={website.url}
        title={website.url}
        target="_blank"
        class="truncate flex flex-row items-center"
      >
        <img
          src={website.favicon || "/placeholder.svg"}
          alt=""
          class="h-4 w-4 mr-2 flex-shrink-0"
        />
        {website.title}
      </a>
    </div>
    <div class="flex items-center gap-1 ml-2">
      <Button
        variant={website.status === ReadingStatus.TO_READ
          ? "outline_primary"
          : "outline_blue"}
        size="icon"
        class="h-6 w-6 flex-shrink-0"
        onclick={() => {
          const status =
            website.status === ReadingStatus.TO_READ
              ? ReadingStatus.URGENT
              : ReadingStatus.TO_READ;

          app.updateWebsiteStatus(website.folderName, website.id, status);
        }}
      >
        {#if website.status === ReadingStatus.TO_READ}
          <AlertCircle class="h-4 w-4 text-red-500" />
        {:else if website.status === ReadingStatus.URGENT}
          <Book class="h-4 w-4 text-blue-500" />
        {/if}
      </Button>
      <Button
        variant="outline_green"
        size="icon"
        class="h-6 w-6 flex-shrink-0"
        onclick={() => {
          app.updateWebsiteStatus(
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
    onclick={() => app.toggleFolder(name)}
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
            onclick={() => app.deleteFolder(name)}
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
    <div class="py-1">
      {#if websites.length === 0}
        <div class="py-2 text-center text-sm text-muted-foreground">
          No websites in this folder
        </div>
      {:else}
        <div>
          {#if folder.showAll}
            {#each websites as website}
              {@render websiteItem(website)}
            {/each}
          {:else}
            {#each websites.slice(0, 3) as website}
              {@render websiteItem(website)}
            {/each}
          {/if}

          {#if folder.websites.length > 3}
            <Button
              variant="ghost"
              size="sm"
              class="w-full mt-1"
              onclick={() => app.toggleShowAll(name)}
            >
              <div class="flex flex-row gap-2 items-center justify-center">
                {#if folder.showAll}
                  <ChevronUp class="h-4 w-4 mr-2" />
                  Show Less
                {:else}
                  <ChevronDown class="h-4 w-4 mr-2" />
                  Show All ({folder.websites.length})
                {/if}
              </div>
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
    app.updateFolderName(name, newFolderName);
    newFolderName = "";
  }}
  bind:isOpen={isOpenRenameDialog}
>
  {#snippet body()}
    <Input bind:value={newFolderName} />
  {/snippet}
</CustomDialog>
