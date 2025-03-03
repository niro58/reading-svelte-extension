<script lang="ts">
  import "./app.css";
  import { setPostController, type Post } from "$lib/posts.svelte";
  import { setDatabase } from "$lib/database.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  const db = setDatabase();
  const postController = setPostController();
  $effect(() => {
    if (db.db) {
      postController.db = db.db;
    }
  });
</script>

<main>
  <Button
    onclick={() => {
      const post: Partial<Post> = {
        url: "lol",
        title: "test",
        folderId: 1,
      };
      postController.add(post).then((res) => {
        console.log(res);
      });
    }}>add</Button
  >
  <Button
    onclick={() => {
      postController.getAll().then((res) => {
        console.log(res);
      });
    }}
  >
    get
  </Button>
  <div id="logger"></div>
</main>
