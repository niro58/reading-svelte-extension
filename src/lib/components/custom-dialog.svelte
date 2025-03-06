<script lang="ts">
  import * as Dialog from "./ui/dialog/index";
  import type { Snippet } from "svelte";
  import Button from "./ui/button/button.svelte";

  interface Props {
    onAccept: () => void;
    onReject?: () => void;
    title: string;
    isOpen?: boolean;
    trigger?: Snippet<[]>;
    body: Snippet<[]>;
  }

  let {
    onAccept,
    onReject,
    title,
    isOpen = $bindable(false),
    trigger,
    body,
  }: Props = $props();
</script>

<Dialog.Root bind:open={isOpen}>
  {#if trigger}
    <Dialog.Trigger class="w-full">
      {#snippet children()}
        {@render trigger()}
      {/snippet}
    </Dialog.Trigger>
  {/if}
  <Dialog.Content
    class="data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] bg-background fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg"
  >
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
    </Dialog.Header>
    {@render body()}
    <Dialog.Footer>
      <Dialog.Close>
        {#snippet children()}
          <Button
            onclick={() => {
              if (onReject) {
                onReject();
              }
            }}
            variant="outline">Cancel</Button
          >
        {/snippet}
      </Dialog.Close>
      <Dialog.Close>
        {#snippet children()}
          <Button onclick={onAccept}>Add</Button>
        {/snippet}
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
