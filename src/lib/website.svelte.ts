import { getContext, setContext } from "svelte";

import type { ReadingFolder, ReadingStatus, Result, Website } from "./types";

export class WebsiteController {
  db: IDBDatabase | undefined = $state();
  static migrate(db: IDBDatabase) {
    if (!db.objectStoreNames.contains("websites")) {
      const store = db.createObjectStore("websites", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("folderName", "folderName", { unique: false });
      store.createIndex("title", "title", { unique: false });
      store.createIndex("url", "url", { unique: true });
      store.createIndex("favicon", "favicon", { unique: false });
      store.createIndex("createdAt", "createdAt", { unique: false });
      store.createIndex("status", "status", { unique: false });
    }
  }
  async update(website: Website): Promise<Result<boolean>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };

    const transaction = this.db.transaction("websites", "readwrite");
    const store = transaction.objectStore("websites");
    const req = store.put(website);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve({ success: true, data: true });
      };
      req.onerror = () => {
        resolve({ success: false, error: "rip" });
      };
    });
  }
  async delete(id: number): Promise<Result<boolean>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };

    const transaction = this.db.transaction("websites", "readwrite");
    const store = transaction.objectStore("websites");
    const req = store.delete(id);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve({ success: true, data: true });
      };
      req.onerror = () => {
        resolve({ success: false, error: "rip" });
      };
    });
  }
  async deleteFolder(folderName: string): Promise<Result<boolean>> {
    if (!this.db) {
      return {
        success: false,
        error: "rip",
      };
    }

    const transaction = this.db.transaction("websites", "readwrite");
    const store = transaction.objectStore("websites");
    const index = store.index("folderName");
    const range = IDBKeyRange.only(folderName);
    const req = index.openCursor(range);

    return new Promise((resolve, reject) => {
      req.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve({ success: true, data: true });
        }
      };
      req.onerror = () => {
        resolve({ success: false, error: "rip" });
      };
    });
  }
  async add(
    model: Omit<Website, "id" | "created_at">
  ): Promise<Result<Website>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };

    const transaction = this.db.transaction("websites", "readwrite");
    const store = transaction.objectStore("websites");
    const req = store.add(JSON.parse(JSON.stringify(model)));

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve({
          success: true,
          data: { ...model, id: req.result as number },
        });
      };
      req.onerror = () => {
        resolve({ success: false, error: "rip" });
      };
    });
  }
  async get(id: number): Promise<Result<Website | undefined>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };
    const transaction = this.db.transaction("websites", "readonly");
    const store = transaction.objectStore("websites");
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
  async getAll(status?: ReadingStatus): Promise<Result<Website[]>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };
    const transaction = this.db.transaction("websites", "readonly");
    const store = transaction.objectStore("websites");
    const req = store.getAll(status ? IDBKeyRange.only(status) : undefined);
    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve({
          success: true,
          data: req.result || [],
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
  async updateFolderName(
    name: string,
    newName: string
  ): Promise<Result<boolean>> {
    if (!this.db)
      return {
        success: false,
        error: "rip",
      };

    const transaction = this.db.transaction("websites", "readwrite");
    const store = transaction.objectStore("websites");
    const index = store.index("folderName");
    const range = IDBKeyRange.only(name);
    const req = index.openCursor(range);

    return new Promise((resolve, reject) => {
      req.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.value.folderName = newName;
          cursor.update(cursor.value);
          cursor.continue();
        } else {
          resolve({ success: true, data: true });
        }
      };
      req.onerror = () => {
        resolve({ success: false, error: "rip" });
      };
    });
  }
}

const Website_CONTROLLER_SYMBOL = Symbol("Website_CONTROLLER");

export function setWebsiteController() {
  return setContext(Website_CONTROLLER_SYMBOL, new WebsiteController());
}
export function getWebsiteController() {
  return getContext<ReturnType<typeof setWebsiteController>>(
    Website_CONTROLLER_SYMBOL
  );
}
