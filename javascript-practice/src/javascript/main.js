import TaskManager from './task-manager.js';

window.onload = (e) => {
  const taskManager = new TaskManager();
  taskManager.init();
};
