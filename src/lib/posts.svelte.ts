import { getContext, onMount, setContext } from "svelte";
import { addLog } from "./logger.svelte";
import type { Result } from "./types";

export const PageState = Object.freeze({
  TO_READ: 0,
  READ: 1,
  ARCHIVED: 2,
} as const);
export type Post = {
  id: number;
  url: string;
  title: string;
  folderId: number;
};
export class PostController {
  db: IDBDatabase | undefined = $state();
  static migrate(db: IDBDatabase) {
    if (!db.objectStoreNames.contains("posts")) {
      const store = db.createObjectStore("posts", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("folderId", "folderId", { unique: false });
      store.createIndex("url", "url", { unique: true });
      store.createIndex("title", "title", { unique: false });
    }
  }

  async add(post: Partial<Post>): Promise<Result<boolean>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };

    const transaction = this.db.transaction("posts", "readwrite");
    const store = transaction.objectStore("posts");
    const req = store.add(post);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve({ success: true, data: true });
      };
      req.onerror = () => {
        resolve({ success: false, error: "rip" });
      };
    });
  }
  async get(id: number): Promise<Result<Post | undefined>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };
    const transaction = this.db.transaction("posts", "readonly");
    const store = transaction.objectStore("posts");
    const req = store.get(id);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        resolve({
          success: false,
          error: "rip",
        });
      };
    });
  }
  async getAll(): Promise<Result<Post[] | undefined>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };
    const transaction = this.db.transaction("posts", "readonly");
    const store = transaction.objectStore("posts");
    const req = store.getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve({
          success: true,
          data: req.result,
        });
      };
      req.onerror = () => {
        resolve({
          success: false,
          error: "rip",
        });
      };
    });
  }
  async getByFolderId(folderId: number) {
    if (!this.db) return;
    const transaction = this.db.transaction("posts", "readonly");
    const store = transaction.objectStore("posts");
    const index = store.index("folderId");
    return index.getAll(folderId);
  }
}

const POST_CONTROLLER_SYMBOL = Symbol("POST_CONTROLLER");

export function setPostController() {
  return setContext(POST_CONTROLLER_SYMBOL, new PostController());
}
export function getPostController() {
  return getContext<ReturnType<typeof setPostController>>(
    POST_CONTROLLER_SYMBOL
  );
}
