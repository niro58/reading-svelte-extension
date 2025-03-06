<script lang="ts">
  import "./app.css";
  import CurrentPage from "$lib/components/current-page.svelte";
  import Faq from "$lib/components/faq.svelte";
  import FolderList from "$lib/components/folder-list.svelte";
  import { Button } from "$lib/components/ui/button";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import { Input } from "$lib/components/ui/input";
  import Label from "$lib/components/ui/label/label.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import * as Select from "$lib/components/ui/select/index";
  import * as Tabs from "$lib/components/ui/tabs/index";
  import UrgentWebsites from "$lib/components/urgent-websites.svelte";
  import { setDatabase } from "$lib/database.svelte";
  import { ReadingStatus, type ReadingFolder, type Website } from "$lib/types";
  import { setWebsiteController } from "$lib/website.svelte";
  import { Plus } from "lucide-svelte";
  import ReadWebsites from "$lib/components/read-websites.svelte";
  import CustomDialog from "$lib/components/custom-dialog.svelte";

  let folders: { [name: string]: ReadingFolder } = $state({});

  let newFolderName = $state("");
  const blankWebsite: Omit<Website, "id" | "created_at"> = {
    folderName: "",
    title: "",
    url: "",
    status: ReadingStatus.TO_READ,
  };
  let newWebsite: Omit<Website, "id" | "created_at"> = $state(blankWebsite);

  // Toggle folder expansion
  const toggleFolder = (folderName: string) => {
    folders[folderName].expanded = !folders[folderName].expanded;
  };

  // Toggle show all websites in a folder
  const toggleShowAll = (folderName: string) => {
    folders[folderName].showAll = !folders[folderName].showAll;
  };

  // Add new website
  const addWebsite = (website: typeof newWebsite) => {
    if (!website.title.trim() || !website.url.trim() || !website.folderName)
      return;
    websiteController.add(website).then((res) => {
      if (res.success) {
        if (!folders[website.folderName]) {
          folders[res.data.folderName] = {
            websites: [res.data],
            expanded: false,
            showAll: false,
          };
        } else {
          folders[website.folderName].websites.push(res.data);
        }
        website = blankWebsite;
      }
    });
  };

  const updateWebsiteStatus = (
    folderName: string,
    websiteId: number,
    status: ReadingStatus
  ) => {
    const website = folders[folderName].websites.find(
      (w) => w.id === websiteId
    );
    if (!website) return;
    const temp = website.status;
    website.status = status;
    websiteController.update(website).then((res) => {
      if (res.success) {
        folders[folderName].websites = folders[folderName].websites.map((w) =>
          w.id === website.id ? website : w
        );
      } else {
        website.status = temp;
      }
    });
  };

  // Toggle website urgency
  const toggleUrgency = (website: Website) => {
    website.status =
      website.status === ReadingStatus.URGENT
        ? ReadingStatus.TO_READ
        : ReadingStatus.URGENT;

    websiteController.update(website).then((res) => {
      if (res.success) {
        folders[website.folderName].websites = folders[
          website.folderName
        ].websites.map((w) => (w.id === website.id ? website : w));
      } else {
        website.status =
          website.status === ReadingStatus.URGENT
            ? ReadingStatus.TO_READ
            : ReadingStatus.URGENT;
      }
    });
  };

  // Delete website
  const deleteWebsite = (websiteId: number, folderName: string) => {
    websiteController.delete(websiteId).then((res) => {
      if (res.success) {
        folders[folderName].websites = folders[folderName].websites.filter(
          (website) => website.id !== websiteId
        );
      }
    });
  };

  function deleteFolder(folderName: string) {
    websiteController.deleteFolder(folderName).then((res) => {
      if (res.success) {
        delete folders[folderName];
      }
    });
  }
  function updateFolderName(folderName: string, newName: string) {
    websiteController.updateFolderName(folderName, newName).then((res) => {
      console.log(res);
      if (res.success) {
        folders[newName] = folders[folderName];
        delete folders[folderName];
      }
    });
  }

  const db = setDatabase();
  const websiteController = setWebsiteController();

  $effect(() => {
    if (db.db) {
      websiteController.db = db.db;
      websiteController.getAll().then((res) => {
        if (res.success) {
          const f = new Map<string, ReadingFolder>();

          res.data.forEach((website) => {
            const folderName = website.folderName || "default";
            if (!f.has(folderName)) {
              f.set(folderName, {
                websites: [],
                expanded: false,
                showAll: false,
              });
            }
            f.get(folderName)!.websites.push(website);
          });
          folders = Object.fromEntries(f);
        }
      });
    }
  });
</script>

<div
  class="w-[350px] h-[500px] flex flex-col bg-background text-foreground overflow-hidden p-3"
>
  <CurrentPage
    {folders}
    onAddWebsite={addWebsite}
    onUpdateStatus={updateWebsiteStatus}
    onToggleUrgent={toggleUrgency}
  />

  <div class="py-4 border-b flex items-center justify-between">
    <h1 class="text-lg font-semibold">Reading List</h1>
    <div class="flex gap-2">
      <CustomDialog
        title="Add to Reading List"
        onAccept={() => {
          addWebsite(newWebsite);
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
                    {#each Object.keys(folders) as folder}
                      <Select.Item value={folder}>
                        {folder}
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
        <FolderList
          {folders}
          onToggleFolder={toggleFolder}
          onToggleShowAll={toggleShowAll}
          onUpdateWebsiteStatus={updateWebsiteStatus}
          onDeleteWebsite={deleteWebsite}
          onDeleteFolder={deleteFolder}
          onUpdateFolderName={updateFolderName}
        />
      </Tabs.Content>
      <Tabs.Content value="urgent" class="flex-1 overflow-hidden space-y-2">
        <UrgentWebsites
          websites={Object.values(folders)
            .flatMap((f) => f.websites)
            .filter((w) => w.status === ReadingStatus.URGENT)}
        />
      </Tabs.Content>
      <Tabs.Content value="read" class="flex-1 overflow-hidden space-y-2">
        <ReadWebsites
          websites={Object.values(folders)
            .flatMap((f) => f.websites)
            .filter((w) => w.status === ReadingStatus.ARCHIVED)}
          onUpdateWebsiteStatus={updateWebsiteStatus}
        />
      </Tabs.Content>
      <Tabs.Content value="faq" class="flex-1 overflow-hidden">
        <Faq />
      </Tabs.Content>
    </ScrollArea>
  </Tabs.Root>
</div>
