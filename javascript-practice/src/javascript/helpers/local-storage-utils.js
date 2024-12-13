class LocalStorageUtil {
  constructor(storageKey = 'tasks') {
    this.storageKey = storageKey;
  }
  save(tasks) {
    try {
      // Convert tasks to JSON for storage
      const serializedTasks = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority,
        description: task.description,
        category: task.category,
        status: task.status,
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
          taskData.title,
          taskData.startDate,
          taskData.endDate,
          taskData.description,
          taskData.priority,
          taskData.category,
        );

        // Restore additional properties
        task.id = taskData.id;
        task.status = taskData.status;

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
