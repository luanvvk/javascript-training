import TASK_STATUS from '../constants/task-status.js';
import ErrorHandler from '../helpers/error-handler-utils.js';

class TaskBaseView {
  constructor() {
    this.initializeProperties();
    this.initializeDOMElements();
  }

  initializeProperties() {
    // Define column configurations for all views
    this.columnConfigs = {
      mainList: {
        toDo: document.querySelector('.list-view .task-list--todo'),
        inProgress: document.querySelector('.list-view .task-list--in-progress'),
        completed: document.querySelector('.list-view .task-list--completed'),
      },
      mainBoard: {
        toDo: document.querySelector('.board-view .task-list--todo'),
        inProgress: document.querySelector('.board-view .task-list--in-progress'),
        completed: document.querySelector('.board-view .task-list--completed'),
      },
      popupList: {
        toDo: document.querySelector('#all-task-modal .list-view .task-list--todo'),
        inProgress: document.querySelector('#all-task-modal .list-view .task-list--in-progress'),
        completed: document.querySelector('#all-task-modal .list-view .task-list--completed'),
      },
      popupBoard: {
        toDo: document.querySelector('#all-task-modal .board-view .task-list--todo'),
        inProgress: document.querySelector('#all-task-modal .board-view .task-list--in-progress'),
        completed: document.querySelector('#all-task-modal .board-view .task-list--completed'),
      },
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
