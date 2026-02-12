/**
 * Safe key-value storage that works in both Expo Go and native builds.
 *
 * Uses a simple in-memory Map so there are zero native dependencies.
 * When you move to EAS / production builds you can swap this back to
 * react-native-mmkv for 30x faster persistent storage.
 */

const _map = new Map<string, string | number | boolean>();

export const mmkvStorage = {
  getString: (key: string): string | undefined => {
    const v = _map.get(key);
    return typeof v === "string" ? v : undefined;
  },
  setString: (key: string, value: string): void => {
    _map.set(key, value);
  },
  getNumber: (key: string): number | undefined => {
    const v = _map.get(key);
    return typeof v === "number" ? v : undefined;
  },
  setNumber: (key: string, value: number): void => {
    _map.set(key, value);
  },
  getBoolean: (key: string): boolean | undefined => {
    const v = _map.get(key);
    return typeof v === "boolean" ? v : undefined;
  },
  setBoolean: (key: string, value: boolean): void => {
    _map.set(key, value);
  },
  delete: (key: string): void => {
    _map.delete(key);
  },
  clearAll: (): void => {
    _map.clear();
  },
  contains: (key: string): boolean => _map.has(key),
};

/**
 * Backwards-compatible export.
 * Previously this was an MMKV instance; callers that accessed `storage`
 * directly should migrate to `mmkvStorage` helpers above.
 */
export const storage = mmkvStorage;
