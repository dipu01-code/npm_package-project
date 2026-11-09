import { Storage } from "./core/storage";
import type { StorageAdapter } from "./core/types";

export interface AsyncStorageLike {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear?: () => Promise<void>;
  getAllKeys?: () => Promise<string[]>;
}

export function reactNativeAdapter(asyncStorage: AsyncStorageLike): StorageAdapter {
  return {
    async getItem(key: string): Promise<string | null> {
      return asyncStorage.getItem(key);
    },
    async setItem(key: string, value: string): Promise<void> {
      await asyncStorage.setItem(key, value);
    },
    async removeItem(key: string): Promise<void> {
      await asyncStorage.removeItem(key);
    },
    async clear(): Promise<void> {
      if (typeof asyncStorage.clear === "function") {
        await asyncStorage.clear();
        return;
      }

      if (typeof asyncStorage.getAllKeys === "function") {
        const keys = await asyncStorage.getAllKeys();
        await Promise.all(keys.map((key) => asyncStorage.removeItem(key)));
        return;
      }

      throw new Error("AsyncStorage adapter does not support clear");
    },
    getAllKeys: asyncStorage.getAllKeys
      ? async (): Promise<string[]> => asyncStorage.getAllKeys!()
      : undefined,
  };
}

export function createStorage(adapter: StorageAdapter): Storage {
  return new Storage({ adapter });
}
