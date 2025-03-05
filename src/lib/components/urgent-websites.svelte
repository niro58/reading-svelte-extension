<script lang="ts">
  import { AlertCircle } from "lucide-svelte";
  import { ReadingStatus, type Website } from "../types";
  import { Badge } from "./ui/badge";
  import { getWebsiteController } from "$lib/website.svelte";
  import { onMount } from "svelte";

  const websiteController = getWebsiteController();
  let websites: Website[] = $state([]);
  onMount(async () => {
    const res = await websiteController.getAll(ReadingStatus.URGENT);
    if (res.success) {
      websites = res.data;
    }
  });
</script>

{#if websites.length === 0}
  <div
    class="flex flex-col items-center justify-center h-full text-muted-foreground"
  >
    <AlertCircle class="h-12 w-12 mb-2" />
    <p>No urgent websites</p>
    <p class="text-sm">Mark websites as urgent to see them here</p>
  </div>
{/if}
<div class="space-y-2">
  {#each websites as website}
    <div class="border rounded-md p-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center overflow-hidden">
          <img
            src={website.favicon || "/placeholder.svg"}
            alt=""
            class="h-4 w-4 mr-2 flex-shrink-0"
          />
          <span class="truncate text-sm">{website.title}</span>
        </div>
        <Badge variant="outline" class="text-xs">
          {website.folderName}
        </Badge>
      </div>
    </div>
  {/each}
</div>
