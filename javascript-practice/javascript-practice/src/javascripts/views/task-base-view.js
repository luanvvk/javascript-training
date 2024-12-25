import TASK_STATUS from '../constants/task-status.js';
import ErrorHandler from '../helpers/error-handler-utils.js';

class TaskBaseView {
  constructor() {
    this.initializeProperties();
    this.initializeDOMElements();
  }

  initializeProperties() {
    this.listViewColumns = {
      toDo: document.querySelector(`.list-view ${TASK_STATUS.TODO_CLASS}`),
      'In Progress': document.querySelector(`.list-view ${TASK_STATUS.RUNNING_CLASS}`),
      completed: document.querySelector(`.list-view ${TASK_STATUS.COMPLETED_CLASS}`),
    };

    this.boardViewColumns = {
      toDo: document.querySelector(`.board-view ${TASK_STATUS.TODO_CLASS}`),
      'In Progress': document.querySelector(`.board-view ${TASK_STATUS.RUNNING_CLASS}`),
      completed: document.querySelector(`.board-view ${TASK_STATUS.COMPLETED_CLASS}`),
    };
  }

  initializeDOMElements() {
    this.errorHandler = new ErrorHandler();
    this.createTaskOverlay = document.getElementById('create-task-modal');
    this.editTaskOverlay = document.getElementById('edit-task-modal');
  }

  showError(message) {
    this.errorHandler.showError(message);
  }
}
export default TaskBaseView;
