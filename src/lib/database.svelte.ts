import { getContext, setContext } from "svelte";
import { PostController } from "./posts.svelte";

export class Database {
  db: IDBDatabase | undefined = $state();
  constructor() {
    const request = indexedDB.open("posts", 1);

    request.onerror = (event) => {
      console.log("error: ", event);
      this.db = undefined;
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };
    request.onupgradeneeded = () => {
      const db = request.result;

      PostController.migrate(db);
    };
  }
}

const DATABASE_CONTROLLER_SYMBOL = Symbol("DATABASE_CONTROLLER");

export function setDatabase() {
  return setContext(DATABASE_CONTROLLER_SYMBOL, new Database());
}
export function getDatabase() {
  return getContext<ReturnType<typeof setDatabase>>(DATABASE_CONTROLLER_SYMBOL);
}
