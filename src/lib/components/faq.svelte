<script lang="ts">
  import * as Accordion from "./ui/accordion/index";
</script>

<Accordion.Root type="single" class="w-full">
  <Accordion.Item value="item-1">
    <Accordion.Trigger
      >How do I add a new website to my reading list?</Accordion.Trigger
    >
    <Accordion.Content>
      Click the "Add" button in the top right corner and select "Add URL". Enter
      the website details and choose a folder to add it to.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>How do I create a new folder?</Accordion.Trigger>
    <Accordion.Content>
      Click the "Add" button in the top right corner and select "New Folder".
      Enter a name for your new folder and click "Create".
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger
      >How do I mark a website as read or unread?</Accordion.Trigger
    >
    <Accordion.Content>
      Click the clock or book icon next to the website to toggle between "To
      Read" and "Read" status.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-4">
    <Accordion.Trigger>How do I mark a website as urgent?</Accordion.Trigger>
    <Accordion.Content>
      Click the three dots menu next to the website and select "Mark as Urgent".
      You can remove the urgent status the same way.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-5">
    <Accordion.Trigger>How do I delete a website or folder?</Accordion.Trigger>
    <Accordion.Content>
      For websites, click the three dots menu and select "Delete". For folders,
      click the three dots menu on the folder and select "Delete".
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-6">
    <Accordion.Trigger>What does the "Urgent" tab show?</Accordion.Trigger>
    <Accordion.Content>
      The "Urgent" tab displays all websites that you've marked as urgent across
      all folders.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-7">
    <Accordion.Trigger
      >Can I rearrange my folders or websites?</Accordion.Trigger
    >
    <Accordion.Content>
      Currently, the extension doesn't support drag-and-drop rearranging.
      Folders and websites are displayed in the order they were added.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-8">
    <Accordion.Trigger
      >Is my reading list synced across devices?</Accordion.Trigger
    >
    <Accordion.Content>
      Your reading list is stored locally in your browser. Syncing across
      devices is not currently supported.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
