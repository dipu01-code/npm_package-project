# SimpleStore

Beginner-friendly, cross-platform local storage for Web and React Native.

## Install

Web:

```bash
npm install @dipu01-code/simplestore
```

React Native / Expo:

```bash
npm install @dipu01-code/simplestore @react-native-async-storage/async-storage
```

## Quick start

```typescript
import { createStorage, webAdapter } from "@dipu01-code/simplestore/web";

const storage = createStorage(webAdapter());

await storage.set("username", "Dipu");
await storage.set("user", { name: "Dipu", age: 19 });

const user = await storage.get<{ name: string; age: number }>("user");
const exists = await storage.has("user");
await storage.remove("user");
await storage.clear();
```

## Documentation

Full documentation, API reference, React Native / Expo setup, and migration guide are coming in the next release phase.

## License

MIT
