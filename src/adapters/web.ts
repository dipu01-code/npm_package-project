import { StorageAdapter } from "../core/types";

let cachedStorage: Storage | null = null;
let storageUnavailable: boolean | null = null;

function getLocalStorage(): Storage | null {
  // Never access window/localStorage at module load — SSR-safe.
  // Resolution happens lazily on first method call.
  if (storageUnavailable === true) {
    return null;
  }
  if (cachedStorage !== null) {
    return cachedStorage;
  }

  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage !== undefined
    ) {
      cachedStorage = window.localStorage;
      return cachedStorage;
    }
    storageUnavailable = true;
    return null;
  } catch {
    storageUnavailable = true;
    return null;
  }
}

function unavailableError(): Error {
  const err = new Error(
    "localStorage is unavailable in this environment"
  ) as Error & { name?: string };
  err.name = "SecurityError";
  return err;
}

export function webAdapter(): StorageAdapter {
  return {
    async getItem(key: string): Promise<string | null> {
      const storage = getLocalStorage();
      if (!storage) {
        return null;
      }
      return storage.getItem(key);
    },

    async setItem(key: string, value: string): Promise<void> {
      const storage = getLocalStorage();
      if (!storage) {
        throw unavailableError();
      }
      storage.setItem(key, value);
    },

    async removeItem(key: string): Promise<void> {
      const storage = getLocalStorage();
      if (!storage) {
        return;
      }
      storage.removeItem(key);
    },

    async clear(): Promise<void> {
      const storage = getLocalStorage();
      if (!storage) {
        return;
      }
      storage.clear();
    },

    async getAllKeys(): Promise<string[]> {
      const storage = getLocalStorage();
      if (!storage) {
        return [];
      }
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key !== null) {
          keys.push(key);
        }
      }
      return keys;
    },
  };
}
