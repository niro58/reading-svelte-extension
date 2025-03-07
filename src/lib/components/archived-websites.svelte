<script lang="ts">
  import { AlertCircle, BookOpen } from "lucide-svelte";
  import { ReadingStatus, type Website } from "../types";
  import { Badge } from "./ui/badge";
  import Button from "./ui/button/button.svelte";
  import { getApp } from "$lib/app_controller.svelte";

  const app = getApp();
  const archivedWebsites: Website[] = $derived.by(() => {
    let webs: Website[] = [];
    if (app) {
      app.folders.forEach((f) => {
        webs = webs.concat(
          f.websites.filter((w) => w.status === ReadingStatus.ARCHIVED)
        );
      });
    }
    return webs;
  });
</script>

{#if archivedWebsites.length === 0}
  <div
    class="flex flex-col items-center justify-center h-full text-muted-foreground p-4"
  >
    <AlertCircle class="h-12 w-12 mb-2" />
    <p>No read websites</p>
    <p class="text-sm">Mark websites as read to see them here</p>
  </div>
{/if}
<div class="flex flex-col gap-2">
  {#each archivedWebsites as website}
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
        <div class="flex flex-row gap-2">
          <Badge variant="outline" class="text-xs">
            {website.folderName}
          </Badge>
          <Button
            onclick={() => {
              app.updateWebsiteStatus(
                website.folderName,
                website.id,
                ReadingStatus.TO_READ
              );
            }}
            variant="outline"
            size="icon"
            class="h-6 w-6 flex-shrink-0"
          >
            <BookOpen class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  {/each}
</div>
