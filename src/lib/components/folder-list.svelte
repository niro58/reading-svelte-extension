<script lang="ts">
  import { Folder } from "lucide-svelte";
  import FolderItem from "./folder-item.svelte";
  import { getApp } from "$lib/app_controller.svelte";

  const app = getApp();
</script>

{#if app.folders.size === 0}
  <div
    class="flex flex-col items-center justify-center h-full text-muted-foreground p-4"
  >
    <Folder class="h-12 w-12 mb-2" />
    <p>No folders yet</p>
    <p class="text-sm">Create a website to get started</p>
  </div>
{:else}
  {#each app.folders as [name, folder]}
    <FolderItem {name} {folder} />
  {/each}
{/if}
