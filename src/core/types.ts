export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys?(): Promise<string[]>;
}

export interface StorageConfig {
  adapter: StorageAdapter;
}

export interface MultiGetResult<T = unknown> {
  key: string;
  value: T | undefined;
}

export interface StorageInterface {
  set<T = unknown>(key: string, value: T): Promise<void>;
  get<T = unknown>(key: string): Promise<T | undefined>;
  has(key: string): Promise<boolean>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiSet<T = unknown>(items: Array<[string, T]>): Promise<void>;
  multiGet<T = unknown>(keys: string[]): Promise<Array<MultiGetResult<T>>>;
}
