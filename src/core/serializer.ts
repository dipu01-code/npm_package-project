import { SimpleStoreError } from "./errors";
import { JSONValue } from "./types";

export function serialize(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (err) {
    throw new SimpleStoreError(
      "Failed to serialize value to JSON",
      "SERIALIZATION_ERROR",
      err instanceof Error ? err : new Error(String(err))
    );
  }
}

export function deserialize<T = unknown>(
  key: string,
  raw: string | null
): T | undefined {
  if (raw === null) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new SimpleStoreError(
      `Malformed JSON data for key "${key}"`,
      "MALFORMED_DATA",
      err instanceof Error ? err : new Error(String(err))
    );
  }
}

export function validateKey(key: unknown): asserts key is string {
  if (typeof key !== "string" || key.length === 0) {
    throw new SimpleStoreError(
      `Invalid key: expected a non-empty string, received ${typeof key}`,
      "INVALID_KEY"
    );
  }
}

export function validateValue(value: unknown): asserts value is JSONValue {
  if (
    value === undefined ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    throw new SimpleStoreError(
      `Unsupported value: cannot store ${typeof value}`,
      "UNSUPPORTED_VALUE"
    );
  }
}
