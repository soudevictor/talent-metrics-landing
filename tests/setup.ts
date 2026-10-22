import '@testing-library/jest-dom/vitest';

// Node 22+ exposes an experimental global `localStorage` that is unavailable
// unless `--localstorage-file` is set. Vitest's jsdom environment copies that
// undefined property onto `window`, so components under test would see no
// storage. Provide a small in-memory Storage for tests only.
if (typeof window !== 'undefined') {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    getItem(key) {
      return store.get(key) ?? null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: storage,
  });
}
