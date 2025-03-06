<script lang="ts">
  import { Folder } from "lucide-svelte";
  import type { ReadingFolder, ReadingStatus, Website } from "$lib/types";
  import FolderItem from "./folder-item.svelte";

  interface Props {
    folders: { [name: string]: ReadingFolder };
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
    folders = $bindable(),
    onToggleFolder,
    onToggleShowAll,
    onUpdateWebsiteStatus,
    onDeleteWebsite,
    onDeleteFolder,
    onUpdateFolderName,
  }: Props = $props();
</script>

{#if Object.keys(folders).length === 0}
  <div
    class="flex flex-col items-center justify-center h-full text-muted-foreground p-4"
  >
    <Folder class="h-12 w-12 mb-2" />
    <p>No folders yet</p>
    <p class="text-sm">Create a website to get started</p>
  </div>
{:else}
  {#each Object.entries(folders) as [name, folder]}
    <FolderItem
      {name}
      {folder}
      {onToggleFolder}
      {onToggleShowAll}
      {onUpdateWebsiteStatus}
      {onDeleteWebsite}
      {onDeleteFolder}
      {onUpdateFolderName}
    />
  {/each}
{/if}
