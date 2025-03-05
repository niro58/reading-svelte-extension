<script lang="ts">
  import { Folder } from "lucide-svelte";
  import type { ReadingFolder } from "$lib/types";
  import FolderItem from "./folder-item.svelte";

  interface Props {
    folders: { [name: string]: ReadingFolder };
    onToggleFolder: (folderId: string) => void;
    onToggleShowAll: (folderId: string) => void;
    onUpdateWebsiteStatus: (folderId: string, websiteId: string) => void;
    onToggleUrgency: (folderId: string, websiteId: string) => void;
    onDeleteWebsite: (folderId: string, websiteId: string) => void;
    onDeleteFolder: (folderId: string) => void;
  }
  const {
    folders = $bindable(),
    onToggleFolder,
    onToggleShowAll,
    onUpdateWebsiteStatus,
    onToggleUrgency,
    onDeleteWebsite,
    onDeleteFolder,
  }: Props = $props();
  console.log(folders);
</script>

{#if Object.keys(folders).length === 0}
  <div
    class="flex flex-col items-center justify-center h-full text-muted-foreground p-4"
  >
    <Folder class="h-12 w-12 mb-2" />
    <p>No folders yet</p>
    <p class="text-sm">Create a folder to get started</p>
  </div>
{:else}
  {#each Object.entries(folders) as [name, folder]}
    {folder.expanded}
    <FolderItem
      {name}
      {folder}
      {onToggleFolder}
      {onToggleShowAll}
      {onUpdateWebsiteStatus}
      {onToggleUrgency}
      {onDeleteWebsite}
      {onDeleteFolder}
    />
  {/each}
{/if}
