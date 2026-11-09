import { StorageAdapter, StorageInterface, MultiGetResult } from "./types";
import { SimpleStoreError } from "./errors";
import { serialize, deserialize, validateKey, validateValue } from "./serializer";

export class Storage implements StorageInterface {
  private readonly adapter: StorageAdapter;

  constructor(config: { adapter: StorageAdapter }) {
    this.adapter = config.adapter;
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    validateKey(key);
    validateValue(value);
    const serialized = serialize(value);
    try {
      await this.adapter.setItem(key, serialized);
    } catch (err) {
      throw this.wrapError(err, key);
    }
  }

  async get<T = unknown>(key: string): Promise<T | undefined> {
    validateKey(key);
    let raw: string | null;
    try {
      raw = await this.adapter.getItem(key);
    } catch (err) {
      throw this.wrapError(err, key);
    }
    return deserialize<T>(key, raw);
  }

  async has(key: string): Promise<boolean> {
    validateKey(key);
    let raw: string | null;
    try {
      raw = await this.adapter.getItem(key);
    } catch (err) {
      throw this.wrapError(err, key);
    }
    return raw !== null;
  }

  async remove(key: string): Promise<void> {
    validateKey(key);
    try {
      await this.adapter.removeItem(key);
    } catch (err) {
      throw this.wrapError(err, key);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.adapter.clear();
    } catch (err) {
      throw this.wrapError(err, undefined);
    }
  }

  async getAllKeys(): Promise<string[]> {
    if (typeof this.adapter.getAllKeys !== "function") {
      throw new SimpleStoreError(
        "Adapter does not support getAllKeys",
        "UNKNOWN_ERROR"
      );
    }
    try {
      return await this.adapter.getAllKeys!();
    } catch (err) {
      throw this.wrapError(err, undefined);
    }
  }

  async multiSet<T = unknown>(items: Array<[string, T]>): Promise<void> {
    for (const [key, value] of items) {
      validateKey(key);
      validateValue(value);
    }
    for (const [key, value] of items) {
      try {
        await this.adapter.setItem(key, serialize(value));
      } catch (err) {
        throw this.wrapError(err, key);
      }
    }
  }

  async multiGet<T = unknown>(keys: string[]): Promise<Array<MultiGetResult<T>>> {
    const results: Array<MultiGetResult<T>> = [];
    for (const key of keys) {
      validateKey(key);
      let raw: string | null;
      try {
        raw = await this.adapter.getItem(key);
      } catch (err) {
        throw this.wrapError(err, key);
      }
      results.push({ key, value: deserialize<T>(key, raw) });
    }
    return results;
  }

  private wrapError(err: unknown, key: string | undefined): SimpleStoreError {
    if (err instanceof SimpleStoreError) {
      return err;
    }

    if (err instanceof Error) {
      const message = err.message;
      const name = err.name;
      const isQuota =
        name === "QuotaExceededError" ||
        /quota/i.test(message) ||
        /QUOTA_EXCEEDED/i.test(message);
      const isUnavailable =
        name === "SecurityError" ||
        /security/i.test(message) ||
        /unavailable/i.test(message);

      if (isQuota) {
        return new SimpleStoreError(
          key
            ? `Storage quota exceeded for key "${key}"`
            : "Storage quota exceeded",
          "QUOTA_EXCEEDED",
          err
        );
      }
      if (isUnavailable) {
        return new SimpleStoreError(
          key
            ? `Storage access denied for key "${key}"`
            : "Storage access denied",
          "STORAGE_UNAVAILABLE",
          err
        );
      }
      return new SimpleStoreError(
        key
          ? `Storage operation failed for key "${key}": ${message}`
          : `Storage operation failed: ${message}`,
        "UNKNOWN_ERROR",
        err
      );
    }

    return new SimpleStoreError(
      key ? `Storage operation failed for key "${key}"` : "Storage operation failed",
      "UNKNOWN_ERROR"
    );
  }
}
