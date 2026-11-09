import { SimpleStoreError } from "./core/errors";
import { Storage } from "./core/storage";
import type { StorageAdapter } from "./core/types";

interface WebStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
}

function getDefaultStorage(): WebStorageLike {
  if (typeof globalThis === "undefined" || !("localStorage" in globalThis)) {
    throw new SimpleStoreError(
      "Web storage is unavailable in this environment",
      "STORAGE_UNAVAILABLE"
    );
  }

  const storage = (globalThis as { localStorage: WebStorageLike }).localStorage;
  if (!storage) {
    throw new SimpleStoreError(
      "Web storage is unavailable in this environment",
      "STORAGE_UNAVAILABLE"
    );
  }

  return storage;
}

export function webAdapter(storage: WebStorageLike = getDefaultStorage()): StorageAdapter {
  return {
    async getItem(key: string): Promise<string | null> {
      return storage.getItem(key);
    },
    async setItem(key: string, value: string): Promise<void> {
      storage.setItem(key, value);
    },
    async removeItem(key: string): Promise<void> {
      storage.removeItem(key);
    },
    async clear(): Promise<void> {
      storage.clear();
    },
    async getAllKeys(): Promise<string[]> {
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        if (key !== null) {
          keys.push(key);
        }
      }
      return keys;
    },
  };
}

export function createStorage(adapter: StorageAdapter = webAdapter()): Storage {
  return new Storage({ adapter });
}
