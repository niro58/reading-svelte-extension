<script lang="ts">
  import { ReadingStatus, type Website } from "$lib/types";
  import { AlertCircle, BookOpen, Clock, MoreHorizontal, Trash2 } from "lucide-svelte";
  import * as Tooltip from "./ui/tooltip/index";
  import Button from "./ui/button/button.svelte";
  import * as DropdownMenu from "./ui/dropdown-menu/index";

  interface Props {
    website: Website;
    folderId: string;
    onUpdateStatus: (folderId: string, websiteId: string) => void;
    onToggleUrgency: (folderId: string, websiteId: string) => void;
    onDelete: (folderId: string, websiteId: string) => void;
  }

  const {
    website,
    folderId,
    onUpdateStatus,
    onToggleUrgency,
    onDelete,
  }: Props = $props();
</script>

<div
  class="px-2 py-1 rounded-md flex items-center justify-between hover:bg-muted"
>
  <div class="flex items-center overflow-hidden min-w-0 flex-1">
    <img
      src={website.favicon || "/placeholder.svg"}
      alt=""
      class="h-4 w-4 mr-2 flex-shrink-0"
    />
    <span class="truncate text-sm">{website.title}</span>
    {#if website.status === ReadingStatus.URGENT}
      <AlertCircle class="h-4 w-4 ml-2 text-red-500 flex-shrink-0" />
    {/if}
  </div>
  <div class="flex items-center gap-1 ml-2">
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet children()}
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 flex-shrink-0"
              onclick={() => onUpdateStatus(folderId, website.id)}
            >
              {#if website.status === ReadingStatus.TO_READ}
                <Clock class="h-4 w-4 text-blue-500" />
              {:else if website.status === ReadingStatus.READ}
                <BookOpen class="h-4 w-4 text-green-500" />
              {/if}
            </Button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>
            {website.status === ReadingStatus.TO_READ ? "Mark as Read" : "Mark as To Read"}
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet children()}
          <Button variant="ghost" size="icon" class="h-6 w-6 flex-shrink-0">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item
          onclick={() => onToggleUrgency(folderId, website.id)}
        >
          <AlertCircle class="h-4 w-4 mr-2 text-red-500" />
          {website.status === ReadingStatus.URGENT ? "Remove Urgency" : "Mark as Urgent"}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onclick={() => onDelete(folderId, website.id)}
          class="text-destructive"
        >
          <Trash2 class="h-4 w-4 mr-2" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</div>
