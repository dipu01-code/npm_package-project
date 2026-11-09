import { describe, expect, it } from "vitest";
import { createStorage, webAdapter } from "../src/web";

function createMockWebStorage() {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    key(index: number): string | null {
      return Array.from(map.keys())[index] ?? null;
    },
    getItem(key: string): string | null {
      return map.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      map.set(key, value);
    },
    removeItem(key: string): void {
      map.delete(key);
    },
    clear(): void {
      map.clear();
    },
  };
}

describe("web adapter entrypoint", () => {
  it("creates storage that can persist and list keys", async () => {
    const storage = createStorage(webAdapter(createMockWebStorage()));

    await storage.set("user", { name: "Dipu" });

    await expect(storage.get("user")).resolves.toEqual({ name: "Dipu" });
    await expect(storage.getAllKeys()).resolves.toEqual(["user"]);
  });
});
