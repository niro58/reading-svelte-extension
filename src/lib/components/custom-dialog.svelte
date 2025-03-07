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
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
    </Dialog.Header>
    {@render body()}
    <Dialog.Footer class="flex flex-row justify-between">
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
