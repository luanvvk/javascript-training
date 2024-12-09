import SetupEditTaskListeners from './setupEditTaskListeners.js';
import SetupDeleteTaskListeners from './setupDeleteTaskListeners.js';
import SetupCompletedTaskListeners from './setupCompletedTaskListeners.js';

class InitializeEventListeners {
  initializeEventListeners() {
    // Add Task Overlay
    const addTaskBtn = document.querySelectorAll('.add-a-task');
    const createTaskOverlay = document.getElementById('create-task-overlay');
    addTaskBtn.forEach((button) => {
      button.addEventListener('click', () => {
        createTaskOverlay.classList.remove('hide');
        document.body.classList.add('overflow-hidden');
      });
    });

    // Submit Task
    const submitButton = document.querySelector('.button-controls .add-to-list');
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.addTask();
    });

    // Cancel Button
    const cancelButton = document.querySelector('.button-controls .cancel');
    cancelButton.addEventListener('click', () => {
      createTaskOverlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    });

    // Edit Task Listeners
    this.setupEditTaskListeners = new SetupEditTaskListeners();
    this.setupEditTaskListeners.init();
    // Delete Task Listeners
    this.setupDeleteTaskListeners = new SetupDeleteTaskListeners();
    this.setupDeleteTaskListeners.init();
    // Mark as Completed Listeners
    this.setupCompletedTaskListeners = new SetupCompletedTaskListeners();
    this.setupCompletedTaskListeners.init();
  }
}
export default InitializeEventListeners;
