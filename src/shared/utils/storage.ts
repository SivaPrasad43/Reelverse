import AsyncStorage from '@react-native-async-storage/async-storage';

const isBrowser = typeof window !== 'undefined';

export const safeStorage = {
  getItem: (key: string) => {
    if (!isBrowser) return Promise.resolve(null);
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.removeItem(key);
  },
  mergeItem: (key: string, value: string) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.mergeItem(key, value);
  },
  clear: () => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.clear();
  },
  getAllKeys: () => {
    if (!isBrowser) return Promise.resolve([]);
    return AsyncStorage.getAllKeys();
  },
  multiGet: (keys: string[]) => {
    if (!isBrowser) return Promise.resolve([]);
    return AsyncStorage.multiGet(keys);
  },
  multiSet: (keyValuePairs: string[][]) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.multiSet(keyValuePairs);
  },
  multiRemove: (keys: string[]) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.multiRemove(keys);
  },
  multiMerge: (keyValuePairs: string[][]) => {
    if (!isBrowser) return Promise.resolve();
    return AsyncStorage.multiMerge(keyValuePairs);
  },
};

export default safeStorage;
