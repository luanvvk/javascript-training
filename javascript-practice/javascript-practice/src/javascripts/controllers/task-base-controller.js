import ValidationUtils from '../helpers/validation-utils.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';

export default class TaskBaseController {
  constructor(model, modalView, renderView) {
    this.model = model;
    this.renderView = renderView;
    this.modalView = modalView;
    this.tasks = [];
    this.errorHandler = new ErrorHandler();
    this.localStorageUtil = new LocalStorageUtil('tasks');
    this.validationUtils = new ValidationUtils();
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
