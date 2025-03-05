<script lang="ts">
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

  let websites: Website[] = $state([]);
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
    // folders = folders.map((folder) =>
    //   folder.name === folderName
    //     ? { ...folder, showAll: !folder.showAll }
    //     : folder
    // );
  };

  // Add new website
  const addWebsite = (website: typeof newWebsite) => {
    if (!website.title.trim() || !website.url.trim() || !website.folderName)
      return;
    websiteController.add(website).then((res) => {
      if (res.success) {
        website = blankWebsite;
      }
    });
  };

  // Update website status
  const updateWebsiteStatus = (folderName: string, websiteId: string) => {
    // const updatedFolders: ReadingFolder[] = folders.map((folder) => {
    //   if (folder.name === folderName) {
    //     return {
    //       ...folder,
    //       websites: folder.websites.map((website) =>
    //         website.id === websiteId
    //           ? {
    //               ...website,
    //               status: website.status === "to_read" ? "read" : "to_read",
    //             }
    //           : website
    //       ),
    //     };
    //   }
    //   return folder;
    // });
    // folders = updatedFolders;
  };

  // Toggle website urgency
  const toggleUrgency = (folderName: string, websiteId: string) => {
    // const updatedFolders: ReadingFolder[] = folders.map((folder) => {
    //   if (folder.name === folderName) {
    //     return {
    //       ...folder,
    //       websites: folder.websites.map((website) =>
    //         website.id === websiteId
    //           ? { ...website, status: ReadingStatus.URGENT }
    //           : website
    //       ),
    //     };
    //   }
    //   return folder;
    // });
    // folders = updatedFolders;
  };

  // Delete website
  const deleteWebsite = (folderName: string, websiteId: string) => {
    // const updatedFolders = folders.map((folder) => {
    //   if (folder.name === folderName) {
    //     return {
    //       ...folder,
    //       websites: folder.websites.filter(
    //         (website) => website.id !== websiteId
    //       ),
    //     };
    //   }
    //   return folder;
    // });
    // folders = updatedFolders;
  };

  const deleteFolder = (folderName: string) => {
    // folders.filter((folder) => folder.name !== folderName);
  };

  const db = setDatabase();
  const websiteController = setWebsiteController();

  $effect(() => {
    if (db.db) {
      websiteController.db = db.db;
      websiteController.getAll().then((res) => {
        if (res.success) {
          websites = res.data;
          const f = new Map<string, ReadingFolder>();
          websites.forEach((website) => {
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
    {websites}
    onAddWebsite={addWebsite}
    onUpdateStatus={(websiteId, folderName) => {
      updateWebsiteStatus(folderName, websiteId);
    }}
    onToggleUrgent={(websiteId, folderName) => {
      toggleUrgency(folderName, websiteId);
    }}
  />

  <div class="py-4 border-b flex items-center justify-between">
    <h1 class="text-lg font-semibold">Reading List</h1>
    <div class="flex gap-2">
      <Dialog.Root>
        <Dialog.Trigger>
          {#snippet children()}
            <Button size="sm" variant="outline">
              <Plus class="h-4 w-4 mr-1" />
              Add
            </Button>
          {/snippet}
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header>
            <Dialog.Title>Add to Reading List</Dialog.Title>
          </Dialog.Header>
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
            <div class="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                bind:checked={() => newWebsite.status === ReadingStatus.URGENT,
                (v) => {
                  newWebsite.status = v
                    ? ReadingStatus.URGENT
                    : ReadingStatus.TO_READ;
                }}
              />
              <Label for="urgent">Mark as Urgent</Label>
            </div>
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              {#snippet children()}
                <Button variant="outline">Cancel</Button>
              {/snippet}
            </Dialog.Close>
            <Dialog.Close>
              {#snippet children()}
                <Button
                  onclick={() => {
                    addWebsite(newWebsite);
                  }}>Add</Button
                >
              {/snippet}
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>

  <Tabs.Root value="all" class="flex-1 overflow-hidden py-2">
    <Tabs.List class="w-full justify-start border-b px-4 h-12 space-x-2">
      <Tabs.Trigger value="all">All</Tabs.Trigger>
      <Tabs.Trigger value="urgent">Urgent</Tabs.Trigger>
      <Tabs.Trigger value="faq">FAQ</Tabs.Trigger>
    </Tabs.List>

    <ScrollArea class="h-[300px]">
      <Tabs.Content value="all" class="flex-1 overflow-hidden space-y-2">
        <FolderList
          {folders}
          onToggleFolder={toggleFolder}
          onToggleShowAll={toggleShowAll}
          onUpdateWebsiteStatus={updateWebsiteStatus}
          onToggleUrgency={toggleUrgency}
          onDeleteWebsite={deleteWebsite}
          onDeleteFolder={deleteFolder}
        />
      </Tabs.Content>
      <Tabs.Content value="urgent" class="flex-1 overflow-hidden space-y-2">
        <UrgentWebsites />
      </Tabs.Content>
      <Tabs.Content value="faq" class="flex-1 overflow-hidden">
        <Faq />
      </Tabs.Content>
    </ScrollArea>
  </Tabs.Root>
</div>
