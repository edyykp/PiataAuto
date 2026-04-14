import {
  deleteAsync,
  documentDirectory,
  EncodingType,
  readAsStringAsync,
  writeAsStringAsync,
} from "expo-file-system/legacy";

const STORAGE_FILE = `${documentDirectory}piataauto-storage.json`;
const WEB_STORAGE_KEY = "piataauto-storage";
const isWeb = typeof document !== "undefined" && typeof window !== "undefined";

async function readFile(): Promise<Record<string, string>> {
  if (isWeb) {
    const file = window.localStorage.getItem(WEB_STORAGE_KEY);
    if (!file) return {};
    try {
      return JSON.parse(file) as Record<string, string>;
    } catch {
      return {};
    }
  }

  try {
    const contents = await readAsStringAsync(STORAGE_FILE);
    return contents ? (JSON.parse(contents) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

async function writeFile(data: Record<string, string>): Promise<void> {
  if (isWeb) {
    window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(data));
    return;
  }
  await writeAsStringAsync(STORAGE_FILE, JSON.stringify(data), {
    encoding: EncodingType.UTF8,
  });
}

export const storage = {
  async getItem(key: string): Promise<string | null> {
    const data = await readFile();
    return data[key] ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    const data = await readFile();
    data[key] = value;
    await writeFile(data);
  },

  async removeItem(key: string): Promise<void> {
    const data = await readFile();
    if (key in data) {
      delete data[key];
      await writeFile(data);
    }
  },

  async getMany(keys: string[]): Promise<Record<string, string | null>> {
    const data = await readFile();
    return keys.reduce(
      (result, key) => {
        result[key] = data[key] ?? null;
        return result;
      },
      {} as Record<string, string | null>,
    );
  },

  async setMany(entries: Record<string, string>): Promise<void> {
    const data = await readFile();
    Object.assign(data, entries);
    await writeFile(data);
  },

  async removeMany(keys: string[]): Promise<void> {
    const data = await readFile();
    let changed = false;
    for (const key of keys) {
      if (key in data) {
        delete data[key];
        changed = true;
      }
    }
    if (changed) {
      await writeFile(data);
    }
  },

  async getAllKeys(): Promise<string[]> {
    const data = await readFile();
    return Object.keys(data);
  },

  async clear(): Promise<void> {
    if (isWeb) {
      window.localStorage.removeItem(WEB_STORAGE_KEY);
      return;
    }
    await deleteAsync(STORAGE_FILE, { idempotent: true });
  },
};
