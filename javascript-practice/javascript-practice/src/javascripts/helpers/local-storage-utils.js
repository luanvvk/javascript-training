import { STORAGE_KEY } from '../constants/constants.js';
class LocalStorageUtil {
  constructor(storageKey = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  save(data) {
    try {
      // Convert tasks to JSON for storage
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.storageKey, serializedData);
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error.message);
    }
  }

  // Load tasks from localStorage
  load() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) return [];
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error.message);
      return null;
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing tasks from localStorage:', error.message);
    }
  }
}
export default LocalStorageUtil;
