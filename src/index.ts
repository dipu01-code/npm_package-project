export { Storage } from "./core/storage";
export { SimpleStoreError } from "./core/errors";
export type {
  JSONValue,
  JSONArray,
  JSONObject,
  MultiGetResult,
  StorageAdapter,
  StorageConfig,
  StorageInterface,
} from "./core/types";

import { Storage } from "./core/storage";
import type { StorageAdapter } from "./core/types";

export function createStorage(adapter: StorageAdapter): Storage {
  return new Storage({ adapter });
}
