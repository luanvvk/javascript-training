import TaskModel from '../models/task-model.js';
import TaskView from '../views/app-view.js';
import ValidationUtils from '../helpers/validation-utils.js';
import SearchController from '../controllers/search-controller.js';
import FilterController from '../controllers/filter-controller.js';
import NavigationController from '../controllers/navigation-controller.js';
import TaskActionController from '../controllers/task-action-controller.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import {
  createFormElements,
  setupPopupDropdowns,
  renderSortingUI,
} from '../templates/templates.js';

//Declaration
const sideNavbar = document.querySelector('.search-bar__input-bar');
const mainBody = document.querySelector('.app-main');
const toggle = document.querySelector('.topbar__menu-toggle');
const appLogoHeading = document.querySelector('.app__logo-text');

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
      this.view,
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

  bindMethods() {
    this.handleTaskEdit = this.handleTaskEdit.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  initialize() {
    try {
      this.loadDataFromLocalStorage();
      this.setupDynamicForm();
      this.setupEventDelegation();
      this.renderAllTasks();
      this.setupSidebarToggleListener();
      this.setupResponsiveDesignListener();
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

  handleTaskEdit(taskElement) {
    const taskId = parseInt(taskElement.dataset.taskId);

    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      setupPopupDropdowns(task);
      this.editTaskOverlay.dataset.taskId = taskId;
      this.view.openEditTaskOverlay();
      this.view.populateEditForm(task);
    }
  }

  handleTaskItemEvents(e) {
    const taskItem = e.target.closest('.task-item');
    const taskId = parseInt(taskItem.dataset.taskId);
    const task = this.tasks.find((t) => t.id === taskId);

    if (!task) return;

    if (e.target.closest('.status-button')) {
      this.handleStatusChange(task);
    }

    if (e.target.closest('.task-edit')) {
      this.handleTaskEdit(taskItem);
    }

    if (e.target.closest('.task-delete')) {
      this.taskActionController.openDeleteConfirmationPopup(taskId, 'main-view');
    }
  }

  handleStatusChange(task) {
    if (task.status === 'To Do') {
      task.status = 'In Progress';
    } else if (task.status === 'In Progress') {
      task.status = 'Completed';
    } else if (task.status === 'Completed') {
      task.status = 'In Progress';
    }
    this.renderAllTasks();
    this.saveTasksToLocalStorage();
  }

  renderTasks() {
    this.view.renderTasks(this.tasks);
  }

  renderAllTasks() {
    // Render all tasks in the All Tasks Popup,
    this.view.renderAllTasksPopup(this.tasks);
    // Render all tasks in the main view
    this.view.renderTasks(this.tasks);
  }

  // Side bar event
  setupSidebarToggleListener() {
    if (toggle) {
      toggle.addEventListener('click', () => {
        sideNavbar.classList.toggle('active');
        mainBody.classList.toggle('active');
        if (sideNavbar.classList.contains('active')) {
          sideNavbar.classList.add('active');
          appLogoHeading.classList.add('active');
        } else {
          sideNavbar.classList.remove('active');
          appLogoHeading.classList.remove('active');
        }
      });
    }
  }

  setupResponsiveDesignListener() {
    function initCheck(event) {
      if (event.matches) {
        sideNavbar.classList.remove('active');
        mainBody.classList.remove('active');
      } else {
        sideNavbar.classList.add('active');
        mainBody.classList.add('active');
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      let width = window.matchMedia('(min-width: 800px)');
      initCheck(width);
      width.addEventListener('change', initCheck);
    });
  }
}
export default TaskController;
