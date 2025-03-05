<script lang="ts">
  import {
    Folder,
    ChevronRight,
    ChevronDown,
    Clock,
    BookOpen,
    MoreHorizontal,
    Edit,
    Trash2,
    ChevronUp,
  } from "lucide-svelte";
  import { ReadingStatus, type ReadingFolder, type Website } from "../types";
  import * as Tooltip from "./ui/tooltip/index";
  import { Badge } from "./ui/badge";
  import * as DropdownMenu from "./ui/dropdown-menu/index";
  import { Button } from "./ui/button";
  import WebsiteItem from "./website-item.svelte";

  interface Props {
    name: string;
    folder: ReadingFolder;
    onToggleFolder: (folderId: string) => void;
    onToggleShowAll: (folderId: string) => void;
    onUpdateWebsiteStatus: (folderId: string, websiteId: string) => void;
    onToggleUrgency: (folderId: string, websiteId: string) => void;
    onDeleteWebsite: (folderId: string, websiteId: string) => void;
    onDeleteFolder: (folderId: string) => void;
  }
  const {
    name,
    folder,
    onToggleFolder,
    onToggleShowAll,
    onUpdateWebsiteStatus,
    onToggleUrgency,
    onDeleteWebsite,
    onDeleteFolder,
  }: Props = $props();
  const countByStatus = (status: ReadingStatus) => {
    return folder.websites.filter((w: Website) => w.status === status).length;
  };
</script>

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
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Badge variant="outline" class="text-xs">
                <Clock class="h-3 w-3 mr-1 text-blue-500" />
                {countByStatus(ReadingStatus.TO_READ)}
              </Badge>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>To Read</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Badge variant="outline" class="text-xs">
                <BookOpen class="h-3 w-3 mr-1 text-green-500" />
                {countByStatus(ReadingStatus.READ)}
              </Badge>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Read</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
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
          <DropdownMenu.Item>
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
    <div class="py-1">
      {#if folder.websites.length === 0}
        <div class="py-2 text-center text-sm text-muted-foreground">
          No websites in this folder
        </div>
      {:else}{/if}
      <div>
        {#if folder.showAll}
          {#each folder.websites as website}
            <WebsiteItem
              {website}
              folderId={name}
              onUpdateStatus={onUpdateWebsiteStatus}
              {onToggleUrgency}
              onDelete={onDeleteWebsite}
            />
          {/each}
        {:else}
          {#each folder.websites.slice(0, 3) as website}
            <WebsiteItem
              {website}
              folderId={name}
              onUpdateStatus={onUpdateWebsiteStatus}
              {onToggleUrgency}
              onDelete={onDeleteWebsite}
            />
          {/each}
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
    </div>
  {/if}
</div>
