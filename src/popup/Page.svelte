<script lang="ts">
  import "./app.css";
  import CurrentPage from "$lib/components/current-page.svelte";
  import Faq from "$lib/components/faq.svelte";
  import FolderList from "$lib/components/folder-list.svelte";
  import { Button } from "$lib/components/ui/button";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { Input } from "$lib/components/ui/input";
  import Label from "$lib/components/ui/label/label.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import * as Select from "$lib/components/ui/select/index";
  import * as Tabs from "$lib/components/ui/tabs/index";
  import UrgentWebsites from "$lib/components/urgent-websites.svelte";
  import { ReadingStatus, type Website } from "$lib/types";
  import { Plus } from "lucide-svelte";
  import CustomDialog from "$lib/components/custom-dialog.svelte";

  import { blankWebsite, setApp } from "$lib/app_controller.svelte";
  import ArchivedWebsites from "$lib/components/archived-websites.svelte";

  const app: ReturnType<typeof setApp> = setApp();

  let newWebsite: Omit<Website, "id" | "createdAt"> = $state({
    title: "",
    url: "",
    status: ReadingStatus.TO_READ,
    folderName: "",
  });
</script>

<div
  class="w-[350px] h-[500px] flex flex-col bg-background text-foreground overflow-hidden p-3"
>
  <CurrentPage />

  <div class="py-4 border-b flex items-center justify-between">
    <h1 class="text-lg font-semibold">Reading List</h1>
    <div class="flex gap-2">
      <CustomDialog
        title="Add to Reading List"
        onAccept={() => {
          app!.addWebsite(newWebsite);
          newWebsite = blankWebsite;
        }}
      >
        {#snippet trigger()}
          <Button size="sm" variant="outline">
            <Plus class="h-4 w-4 mr-1" />
            Add
          </Button>
        {/snippet}
        {#snippet body()}
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="title">Title</Label>
              <Input
                id="title"
                bind:value={newWebsite.title}
                placeholder="Website title"
              />
            </div>
            <div class="grid gap-2">
              <Label for="url">URL</Label>
              <Input
                id="url"
                bind:value={newWebsite.url}
                placeholder="https://example.com"
              />
            </div>
            <div class="grid gap-2">
              <Label for="folder">Folder</Label>
              <div class="flex flex-row gap-2">
                <Select.Root type="single" bind:value={newWebsite.folderName}>
                  <Select.Trigger>
                    {newWebsite.folderName}
                  </Select.Trigger>
                  <Select.Content>
                    {#each app!.folders as [name]}
                      <Select.Item value={name}>
                        {name}
                      </Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
                <Input
                  bind:value={newWebsite.folderName}
                  placeholder="New folder name"
                />
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                bind:checked={
                  () => newWebsite.status === ReadingStatus.URGENT,
                  (v) => {
                    newWebsite.status = v
                      ? ReadingStatus.URGENT
                      : ReadingStatus.TO_READ;
                  }
                }
              />
              <Label for="urgent">Mark as Urgent</Label>
            </div>
          </div>
        {/snippet}
      </CustomDialog>
    </div>
  </div>

  <Tabs.Root value="all" class="flex-1 overflow-hidden py-2">
    <Tabs.List class="w-full justify-start border-b px-4 h-12 space-x-2">
      <Tabs.Trigger value="all">All</Tabs.Trigger>
      <Tabs.Trigger value="urgent">Urgent</Tabs.Trigger>
      <Tabs.Trigger value="read">Archive</Tabs.Trigger>
      <Tabs.Trigger value="faq">FAQ</Tabs.Trigger>
    </Tabs.List>

    <ScrollArea class="h-[300px]">
      <Tabs.Content value="all" class="flex-1 overflow-hidden space-y-2">
        <FolderList />
      </Tabs.Content>
      <Tabs.Content value="urgent" class="flex-1 overflow-hidden space-y-2">
        <UrgentWebsites />
      </Tabs.Content>
      <Tabs.Content value="read" class="flex-1 overflow-hidden space-y-2">
        <ArchivedWebsites />
      </Tabs.Content>
      <Tabs.Content value="faq" class="flex-1 overflow-hidden">
        <Faq />
      </Tabs.Content>
      <div class="py-4"></div>
    </ScrollArea>
  </Tabs.Root>
</div>
<div class="mt-2 px-2" id="messages"></div>
