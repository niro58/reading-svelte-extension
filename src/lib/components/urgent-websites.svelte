<script lang="ts">
  import { AlertCircle, Archive, BookOpen } from "lucide-svelte";
  import { ReadingStatus, type Website } from "../types";
  import { Badge } from "./ui/badge";
  import { getApp } from "$lib/app_controller.svelte";
  import Button from "./ui/button/button.svelte";

  const app = getApp();

  const urgentWebsites: Website[] = $derived.by(() => {
    let webs: Website[] = [];
    if (app) {
      app.folders.forEach((f) => {
        webs = webs.concat(
          f.websites.filter((w) => w.status === ReadingStatus.URGENT)
        );
      });
    }
    return webs;
  });
</script>

{#if urgentWebsites.length === 0}
  <div
    class="flex flex-col items-center justify-center h-full text-muted-foreground p-4"
  >
    <AlertCircle class="h-12 w-12 mb-2" />
    <p>No urgent websites</p>
    <p class="text-sm">Mark websites as urgent to see them here</p>
  </div>
{/if}
<div class="flex flex-col gap-2">
  {#each urgentWebsites as website}
    <a
      href={website.url}
      target="_blank"
      class="transition-colors hover:bg-primary/50 active:bg-primary/80"
    >
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
              onclick={(e) => {
                e.preventDefault();
                app.updateWebsiteStatus(
                  website.folderName,
                  website.id,
                  ReadingStatus.ARCHIVED
                );
              }}
              variant="outline_green"
              size="icon"
              class="h-6 w-6 flex-shrink-0"
            >
              <Archive class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </a>
  {/each}
</div>
