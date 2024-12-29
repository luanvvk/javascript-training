import TaskModel from '../models/task-model.js';
import TaskRenderView from '../views/task-render-view.js';
import TaskModalView from '../views/task-modal-view.js';
import ValidationUtils from '../helpers/validation-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import {
  createFormElements,
  setupPopupDropdowns,
  renderSortingUI,
} from '../templates/templates.js';
import PopupController from './popup-controller.js';
import SearchController from './search-controller.js';
import NavigationController from './navigation-controller.js';
import FilterController from './filter-controller.js';
import TaskBaseView from '../views/task-base-view.js';

class TaskController {
  constructor() {
    this.initializeCoreComponents();
    this.initializeControllers();
    this.initialize();
  }

  initializeCoreComponents() {
    //Core components
    this.model = new TaskModel();
    this.baseView = new TaskBaseView();
    this.modalView = new TaskModalView();
    this.renderView = new TaskRenderView();
    this.tasks = [];
    // Utilities
    this.localStorageUtil = new LocalStorageUtil('tasks');
    this.validationUtils = new ValidationUtils();
    this.errorHandler = new ErrorHandler();
  }

  initializeControllers() {
    this.popupController = new PopupController(this);
    this.searchController = new SearchController(this);
    this.navigationController = new NavigationController(this);
    this.filterController = new FilterController(this);
  }

  initialize() {
    try {
      this.loadTasksFromLocalStorage();
      this.setupDynamicForm();
      this.renderAllTasks(this.tasks);
    } catch (error) {
      this.errorHandler.log(`Error during initialization: ${error.message}`, 'error');
    }
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
        validationErrors.forEach((error) => this.showError(error));
        return false;
      }
      return true;
    } catch (error) {
      this.errorHandler.log(`Error validating task: ${error.message}`, 'error');
    }
  }

  showError(message) {
    this.errorHandler.showError(message);
  }

  setupDynamicForm() {
    try {
      createFormElements();
      setupPopupDropdowns();
      renderSortingUI();
    } catch (error) {
      this.errorHandler.log(`Error setting up dynamic form: ${error.message}`, 'error');
    }
  }
  setupPopupDropdowns(task) {
    setupPopupDropdowns(task);
  }

  renderTasks() {
    this.renderView.renderTasks(this.tasks);
  }

  renderAllTasks() {
    // Render all tasks in the All Tasks Popup,
    this.renderView.renderAllTasksPopup(this.tasks);
    // Render all tasks in the main view
    this.renderView.renderTasks(this.tasks);
  }
}
export default TaskController;
