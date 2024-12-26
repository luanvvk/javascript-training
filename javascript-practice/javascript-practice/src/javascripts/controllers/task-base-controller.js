import ValidationUtils from '../helpers/validation-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import TaskModel from '../models/task-model.js';
import TaskModalView from '../views/task-modal-view.js';
import TaskRenderView from '../views/task-render-view.js';
import ErrorHandler from '../helpers/error-handler-utils.js';

class TaskBaseController {
  constructor(model, modalView, renderView, errorHandler) {
    if (!this.model) {
      this.model = model || new TaskModel();
    }

    if (!this.modalView) {
      this.modalView = modalView || new TaskModalView();
    }

    if (!this.renderView) {
      this.renderView = renderView || new TaskRenderView();
    }
    this.errorHandler = errorHandler || new ErrorHandler();
    this.tasks = [];

    this.localStorageUtil = new LocalStorageUtil('tasks');
    this.validationUtils = new ValidationUtils();
    this.loadTasksFromLocalStorage();
  }

  loadTasksFromLocalStorage() {
    try {
      this.tasks = this.localStorageUtil.load() || [];
    } catch (error) {
      this.errorHandler.log(`Error loading tasks from local storage: ${error.message}`, 'error');
    }
  }

  saveTasksToLocalStorage() {
    try {
      this.localStorageUtil.save(this.tasks);
    } catch (error) {
      this.errorHandler.log(`Error saving tasks to local storage: ${error.message}`, 'error');
    }
  }

  validate(task) {
    try {
      const validationErrors = this.validationUtils.validateTask(task);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => this.errorHandler.showError(error));
        return false;
      }
      return true;
    } catch (error) {
      this.errorHandler.log(`Error validating task: ${error.message}`, 'error');
      return false;
    }
  }

  showError(message) {
    this.errorHandler.showError(message);
  }

  initializeDOMElements() {
    try {
      this.mainContainer = document.querySelector('.app-main');
      this.taskColumns = document.querySelectorAll('.task-list');
      this.editTaskOverlay = document.getElementById('edit-task-modal');
      this.deleteConfirmationPopup = document.getElementById('confirmation-popup--delete');
      this.sideNavbar = document.querySelector('.app__sidebar');
      this.searchBarTop = document.querySelector('.search-bar__input-bar');
    } catch (error) {
      this.errorHandler.log(`Error initializing DOM elements: ${error.message} `, 'error');
    }
  }

  initialize() {
    try {
      this.setupTaskItemActions();
      this.setupSidebarToggleListener();
      this.setupResponsiveDesignListener();
    } catch (error) {
      this.errorHandler.log(`Initialization error: ${error.message}`);
    }
  }
}
export default TaskBaseController;
