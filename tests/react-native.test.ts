import { describe, expect, it } from "vitest";
import { createStorage, reactNativeAdapter } from "../src/react-native";

function createMockAsyncStorage() {
  const map = new Map<string, string>();
  return {
    async getItem(key: string): Promise<string | null> {
      return map.get(key) ?? null;
    },
    async setItem(key: string, value: string): Promise<void> {
      map.set(key, value);
    },
    async removeItem(key: string): Promise<void> {
      map.delete(key);
    },
    async getAllKeys(): Promise<string[]> {
      return Array.from(map.keys());
    },
  };
}

describe("react-native adapter entrypoint", () => {
  it("clears values using getAllKeys fallback", async () => {
    const asyncStorage = createMockAsyncStorage();
    const storage = createStorage(reactNativeAdapter(asyncStorage));

    await storage.set("a", 1);
    await storage.set("b", 2);
    await storage.clear();

    await expect(storage.getAllKeys()).resolves.toEqual([]);
  });
});
