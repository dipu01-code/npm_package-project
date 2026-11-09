import { createStorage } from "./core/storage";
import { webAdapter } from "./adapters/web";
import type { StorageInterface } from "./core/types";

export { webAdapter };
export type { StorageInterface };

export const storage = createStorage({ adapter: webAdapter() });
