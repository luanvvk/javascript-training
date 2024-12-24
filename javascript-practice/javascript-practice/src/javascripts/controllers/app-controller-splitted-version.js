import TaskModel from './models/TaskModel.js';
import TaskView from './views/TaskView.js';
import ValidationUtils from '../helpers/validation-utils.js';
import SearchController from './controllers/search-controller.js';
import FilterController from './controllers/filter-controller.js';
import NavigationController from './controllers/navigation-controller.js';
import TaskActionController from './controllers/taskAction-controller.js';
import { ErrorHandler } from '../helpers/error-handler-utils.js';
import { LocalStorageUtil } from '../helpers/local-storage-utils.js';
import {
  createFormElements,
  setupPopupDropdowns,
  renderSortingUI,
} from '../templates/templates.js';

class TaskController {
  constructor() {
    this.initializeProperties();
    this.initializeFeatureControllers();
    this.bindMethods();
    this.initialize();
  }

  initializeProperties() {
    this.model = new TaskModel();
    this.view = new TaskView();
    this.tasks = [];
    this.errorHandler = new ErrorHandler();
    this.localStorageUtil = new LocalStorageUtil('tasks');
    this.validationUtils = new ValidationUtils();
  }

  initializeFeatureControllers() {
    this.searchController = new SearchController(this.tasks, this.view);
    this.filterController = new FilterController(this.tasks, this.view);
    this.navigationController = new NavigationController();
    this.taskActionController = new TaskActionController(
      this.tasks,
      this.model,
      this.storageUtil,
      this.errorHandler,
    );
    // task deletion state
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;

    this.initializeDOMElements();
  }

  initializeDOMElements() {
    try {
      this.mainContainer = document.querySelector(DOM_ELEMENTS.MAIN_CONTAINER_SELECTOR);
      this.taskColumns = document.querySelectorAll(DOM_ELEMENTS.TASK_LIST_SELECTOR);
      this.editTaskOverlay = document.getElementById(DOM_ELEMENTS.EDIT_TASK_MODAL_ID);
      this.deleteConfirmationPopup = document.getElementById(
        DOM_ELEMENTS.DELETE_CONFIRMATION_POPUP_ID,
      );
      this.sideNavbar = document.querySelector(DOM_ELEMENTS.SIDE_NAVBAR_SELECTOR);
      this.searchBarTop = document.querySelector(DOM_ELEMENTS.SEARCH_BAR_TOP_SELECTOR);
    } catch (error) {
      this.errorHandler.log(`Error initializing DOM elements: ${error.message} `, 'error');
    }
  }

  bindMethods() {
    const methodToBind = ['handleTaskEdit', 'handleStatusChange', 'confirmTaskDeletion'];
    methodToBind.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  initialize() {
    try {
      this.loadDataFromLocalStorage();
      this.setupDynamicForm();
      this.setupEventDelegation();
      this.renderAllTasks();
    } catch (error) {
      this.errorHandler.log(`Initialization error: ${error.message}`);
    }
  }

  loadDataFromLocalStorage() {
    try {
      this.tasks = this.localStorageUtil.load();
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

  setupEventDelegation() {
    document.querySelector('.app-main').addEventListener('click', (e) => {
      const target = e.target;

      if (target.closest('.board__add-task')) {
        this.handleAddTaskButtonClick();
      }

      if (target.closest('.form__actions .form__button.form__button--add')) {
        e.preventDefault();
        this.taskActionController.handleAddTask();
      }
      if (target.closest('.task-item')) {
        this.handleTaskItemEvents(e);
      }
    });
  }

  handleAddTaskButtonClick() {
    this.view.openCreateTaskOverlay();
    mainBody.classList.remove('active');
    sideNavbar.classList.remove('active');
  }

  handleTaskItemEvents(e) {
    const taskItem = e.target.closest('.task-item');
    const taskId = parseInt(taskItem.dataset.taskId);
    const task = this.tasks.find((t) => t.id === taskId);

    if (!task) return;

    if (e.target.closest('.status-button')) {
      this.taskActionController.handleStatusChange(task);
    }

    if (e.target.closest('.task-edit')) {
      this.taskActionController.handleTaskEdit(task);
    }

    if (e.target.closest('.task-delete')) {
      this.taskActionController.handleTaskDelete(taskId);
    }
  }
}
export default TaskController;
