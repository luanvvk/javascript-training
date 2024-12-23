import { TASK_STORAGE_KEYS } from '../constants/local-storage-keys.js';
class LocalStorageUtil {
  constructor(storageKey = 'tasks') {
    this.storageKey = storageKey;
  }
  save(tasks) {
    try {
      // Convert tasks to JSON for storage
      const serializedTasks = tasks.map((task) => ({
        [TASK_STORAGE_KEYS.ID]: task.id,
        [TASK_STORAGE_KEYS.TITLE]: task.title,
        [TASK_STORAGE_KEYS.START_DATE]: task.startDate,
        [TASK_STORAGE_KEYS.END_DATE]: task.endDate,
        [TASK_STORAGE_KEYS.PRIORITY]: task.priority,
        [TASK_STORAGE_KEYS.DESCRIPTION]: task.description,
        [TASK_STORAGE_KEYS.CATEGORY]: task.category,
        [TASK_STORAGE_KEYS.STATUS]: task.status,
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(serializedTasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }
  // Load tasks from localStorage
  load(TaskModel) {
    try {
      const storedTasks = localStorage.getItem(this.storageKey);

      if (!storedTasks) return [];

      const parsedTasks = JSON.parse(storedTasks);

      // Reconstruct task objects using TaskModel
      return parsedTasks.map((taskData) => {
        const task = new TaskModel(
          taskData[TASK_STORAGE_KEYS.TITLE],
          taskData[TASK_STORAGE_KEYS.START_DATE],
          taskData[TASK_STORAGE_KEYS.END_DATE],
          taskData[TASK_STORAGE_KEYS.DESCRIPTION],
          taskData[TASK_STORAGE_KEYS.PRIORITY],
          taskData[TASK_STORAGE_KEYS.CATEGORY],
        );

        // Restore additional properties
        task.id = taskData[TASK_STORAGE_KEYS.ID];
        task.status = taskData[TASK_STORAGE_KEYS.STATUS];

        return task;
      });
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing tasks from localStorage:', error);
    }
  }
}
export default LocalStorageUtil;
