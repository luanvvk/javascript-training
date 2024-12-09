import InitializeEventListeners from './event-listeners/initializeEventListener.js';
// Task Management Class
class TaskManager {
  constructor() {
    this.tasks = [];
    this.initializeEventListeners = new InitializeEventListeners();
    this.initializeEventListeners.init();
  }
}

export default TaskManager;
