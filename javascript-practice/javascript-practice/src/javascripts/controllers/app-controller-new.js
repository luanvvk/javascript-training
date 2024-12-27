import TaskModel from '../models/task-model.js';
import TaskRenderView from '../views/task-render-view.js';
import TaskModalView from '../views/task-modal-view.js';
import ValidationUtils from '../helpers/validation-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import { showDeletionNotification } from '../helpers/notifications.js';

import {
  createFormElements,
  setupPopupDropdowns,
  renderSortingUI,
} from '../templates/templates.js';
import { PopupController } from './popup-controller.js';
import SearchController from './search-controller.js';
import NavigationController from './navigation-controller.js';
import FilterController from './filter-controller.js';

//Declaration
// filter criteria
const toggle = document.querySelector('.topbar__menu-toggle');
const sideNavbar = document.querySelector('.app__sidebar');
const mainBody = document.querySelector('.app-main');
const appLogoHeading = document.querySelector('.app__logo-text');

class TaskController {
  constructor() {
    this.initializeCoreComponents();
    this.initializeControllers();
    // this.bindMethods();
    this.initialize();
  }

  initializeCoreComponents() {
    //Core components
    this.model = new TaskModel();
    this.renderView = new TaskRenderView();
    this.modalView = new TaskModalView();
    this.tasks = [];
    // Utilities
    this.localStorageUtil = new LocalStorageUtil('tasks');
    this.validationUtils = new ValidationUtils();
    this.errorHandler = new ErrorHandler();
    this.initializeDOMElements();
  }
  initializeControllers() {
    this.popupController = new PopupController(this);
    this.searchController = new SearchController(this);
    this.navigationController = new NavigationController(this);
    this.filterController = new FilterController(this, this.renderView);
  }

  initializeDOMElements() {
    try {
      this.filterFieldDropdown = document.querySelector('.filter__field-dropdown');
      this.filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
      this.sortDropdown = document.querySelector('.sort__dropdown');
      this.sortOrderToggle = document.querySelector('.sort__order-toggle');
      this.mainContainer = document.querySelector('.app-main');
      this.editTaskOverlay = document.getElementById('edit-task-modal');
      this.deleteConfirmationPopup = document.getElementById('confirmation-popup--delete');
      this.sideNavbar = document.querySelector('.app__sidebar');
      this.searchBarTop = document.querySelector('.search-bar__input-bar');
    } catch (error) {
      this.errorHandler.log(`Error initializing DOM elements: ${error.message}`, 'error');
    }
  }

  // bindMethods() {
  //   const methodToBind = ['applyFilters', 'toggleSortOrder'];

  //   methodToBind.forEach((method) => {
  //     this[method] = this[method].bind(this);
  //   });
  // }

  initialize() {
    try {
      this.loadTasksFromLocalStorage();
      this.setupDynamicForm();
      this.setupEventListeners();
      this.renderAllTasks();
    } catch (error) {
      this.errorHandler.log(`Error during initialization: ${error.message}`, 'error');
    }
  }

  loadTasksFromLocalStorage() {
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

  setupEventListeners() {
    try {
      this.setupSidebarToggleListener();
    } catch (error) {
      this.errorHandler.log(`Error setting up event listener: ${error.message}`, 'error');
    }
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

  openDeleteConfirmationPopup(taskId, origin) {
    this.pendingTaskToDelete = taskId;
    this.deleteOrigin = origin;
    // Show the confirmation popup
    this.deleteConfirmationPopup.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  closeDeleteConfirmationPopup() {
    this.deleteConfirmationPopup.classList.add('hidden');
    document.body.classList.add('overflow-hidden');
    // Reset pending deletion info
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;
  }

  confirmTaskDeletion() {
    this.tasks = this.tasks.filter((t) => t.id !== this.pendingTaskToDelete);
    showDeletionNotification();
    this.renderAllTasks();
    this.saveTasksToLocalStorage();
    this.closeDeleteConfirmationPopup();

    if (this.deleteOrigin === 'all-task-modal') {
      const allTaskPopup = document.getElementById('all-task-modal');
      allTaskPopup.classList.remove('hidden');
    }
  }

  // Side bar event
  setupSidebarToggleListener() {
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isActive = sideNavbar.classList.toggle('active');
        mainBody.classList.toggle('active', isActive);
        appLogoHeading.classList.toggle('active', isActive);
      });
    }
  }

  setupResponsiveDesignListener() {
    const initCheck = (event) => {
      const isActive = !event.matches;
      sideNavbar.classList.toggle('active', isActive);
      mainBody.classList.toggle('active', isActive);
    };

    document.addEventListener('DOMContentLoaded', () => {
      let width = window.matchMedia('(min-width: 800px)');
      initCheck(width);
      width.addEventListener('change', initCheck);
    });
  }

  //Setup filter event listeners for filtering and sorting
  // setupFilterEventListeners() {
  //   // Apply event listeners to filters

  //   this.populateFilterOptions('category');

  //   filterFieldDropdown.addEventListener('change', (e) => {
  //     this.populateFilterOptions(e.target.value);
  //   });
  //   if (this.filterOptionsDropdown) {
  //     filterOptionsDropdown.addEventListener('change', this.applyFilters.bind(this));
  //   }

  //   const searchInputs = document.querySelectorAll('.input-bar-mini__main-input');
  //   searchInputs.forEach((input) => {
  //     input.addEventListener('input', this.applyFilters.bind(this));
  //   });
  //   //for sorting event listeners
  //   if (this.sortDropdown) {
  //     this.sortDropdown.addEventListener('change', this.applyFilters.bind(this));
  //   }
  //   if (this.sortOrderToggle) {
  //     this.sortOrderToggle.removeEventListener('click', this.toggleSortOrderHandler);
  //     this.toggleSortOrderHandler = this.toggleSortOrder.bind(this);
  //     this.sortOrderToggle.addEventListener('click', this.toggleSortOrderHandler);
  //   }
  // }

  // // Populate the second dropdown based on the first chosen dropdown
  // populateFilterOptions(field) {
  //   const filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
  //   filterOptionsDropdown.innerHTML = '';

  //   const options =
  //     {
  //       category: ['All', 'Daily Task', 'Weekly Task', 'Monthly Task'],
  //       priority: ['All', 'Not Urgent', 'Urgent Task', 'Important'],
  //       status: ['All', 'To Do', 'In Progress', 'Completed'],
  //     }[field] || [];

  //   // Populate filter options
  //   filterOptionsDropdown.innerHTML = options
  //     .map((opt) => `<option value="${opt}">${opt}</option>`)
  //     .join('');
  // }

  //Apply filters
  //   applyFilters() {
  //     const filterField = filterFieldDropdown ? filterFieldDropdown.value : 'category';
  //     const filterValue = filterOptionsDropdown ? filterOptionsDropdown.value : 'All';
  //     const searchInput = document.querySelector('.input-bar-mini__main-input');
  //     const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

  //     const filterOptions = {
  //       [filterField === 'status'
  //         ? 'status'
  //         : filterField === 'priority'
  //           ? 'priority'
  //           : filterField === 'category'
  //             ? 'category'
  //             : 'All']: filterValue,
  //       searchText: searchText,
  //     };

  //     //Filter tasks
  //     const filteredTasks = this.filterTask(filterOptions);
  //     this.renderView.renderAllTasksPopup(filteredTasks);
  //   }

  //   //filter task method
  //   filterTask(options = {}) {
  //     const { category = 'All', priority = 'All', status = 'All', searchText = '' } = options;

  //     let filteredTasks = this.tasks;
  //     if (searchText) {
  //       filteredTasks = filteredTasks.filter((task) =>
  //         ['title', 'description', 'category', 'priority'].some((field) =>
  //           task[field]?.toLowerCase().includes(searchText),
  //         ),
  //       );
  //     }
  //     // Filter by category
  //     if (category !== 'All') {
  //       filteredTasks = filteredTasks.filter(
  //         (task) => task.category.toLowerCase() === category.toLowerCase(),
  //       );
  //     }
  //     //Filer by priority
  //     if (priority !== 'All') {
  //       filteredTasks = filteredTasks.filter(
  //         (task) => task.priority.toLowerCase() === priority.toLowerCase(),
  //       );
  //     }
  //     //Filter by status
  //     if (status !== 'All') {
  //       filteredTasks = filteredTasks.filter((task) => task.status === status);
  //     }
  //     return filteredTasks;
  //   }

  //   //Sort task method
  //   sortTasks(field, order = 'asc') {
  //     //validate input
  //     const validFields = ['name', 'startDate', 'endDate', 'category', 'priority'];
  //     if (!validFields.includes(field)) {
  //       this.showError(`Invalid sort criteria. Please choose one of: ${validFields.join(', ')}`);

  //       return this.tasks;
  //     }
  //     // Sort handling method:
  //     const getSortValue = (task, field) => {
  //       const sortMap = {
  //         name: task.title?.toLowerCase() || '',
  //         startDate: new Date(task.startDate || '9999-12-31'),
  //         endDate: new Date(task.endDate || '9999-12-31'),
  //         category: task.category?.toLowerCase() || '',
  //         priority:
  //           {
  //             'Not urgent': 1,
  //             'Urgent Task': 2,
  //             Important: 3,
  //           }[task.priority] || 0,
  //       };
  //       return sortMap[field];
  //     };

  //     const sortedTasks = [...this.tasks].sort((a, b) => {
  //       const valueA = getSortValue(a, field);
  //       const valueB = getSortValue(b, field);

  //       if (valueA < valueB) return order === 'asc' ? -1 : 1;
  //       if (valueA > valueB) return order === 'asc' ? 1 : -1;
  //       return 0;
  //     });

  //     this.currentSortSetting = { field, order };
  //     return sortedTasks;
  //   }

  //   //change sort order state
  //   toggleSortOrder(e) {
  //     e.stopPropagation();

  //     const currentOrder = this.currentSortSetting.order;
  //     const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
  //     //update sort order
  //     this.currentSortSetting.order = newOrder;
  //     const sortField = this.sortDropdown.value;
  //     const sortedTasks = this.sortTasks(sortField, newOrder);
  //     this.renderView.renderAllTasksPopup(sortedTasks);

  //     //update button visual state
  //     this.sortOrderToggle.innerHTML =
  //       newOrder === 'asc'
  //         ? ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" />'
  //         : ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-desc.png" alt="sort-icon-down" />';
  //   }
}
export default TaskController;
