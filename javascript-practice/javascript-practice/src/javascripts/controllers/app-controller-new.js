import TaskModel from '../models/task-model.js';
import TaskView from '../views/app-view.js';
import ValidationUtils from '../helpers/validation-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import { showDeletionNotification } from '../helpers/notifications.js';
import SORT_SETTING from '../constants/sort-setting.js';
import DOM_ELEMENTS from '../constants/dom-elements.js';

import {
  createFormElements,
  setupPopupDropdowns,
  renderSortingUI,
} from '../templates/templates.js';

//Declaration
// filter criteria
const filterFieldDropdown = document.querySelector(DOM_ELEMENTS.FILTER_FIELD_DROPDOWN_SELECTOR);
const filterOptionsDropdown = document.querySelector(DOM_ELEMENTS.FILTER_OPTIONS_DROPDOWN_SELECTOR);
const toggle = document.querySelector('.topbar__menu-toggle');
const sideNavbar = document.querySelector(DOM_ELEMENTS.SIDE_NAVBAR_SELECTOR);
const mainBody = document.querySelector(DOM_ELEMENTS.MAIN_CONTAINER_SELECTOR);
const appLogoHeading = document.querySelector('.app__logo-text');

class TaskController {
  constructor() {
    this.initializeProperties();
    this.bindMethods();
    this.initialize();
  }

  initializeProperties() {
    //Core components
    this.model = new TaskModel();
    this.view = new TaskView();
    this.tasks = [];

    // Utilities
    this.localStorageUtil = new LocalStorageUtil('tasks');
    this.validationUtils = new ValidationUtils();
    this.errorHandler = new ErrorHandler();
    // Setting
    this.currentSortSetting = {
      field: SORT_SETTING.FIELD,
      order: SORT_SETTING.SORT_ORDER_ASC,
    };
    // task deletion state
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;

    this.initializeDOMElements();
  }

  initializeDOMElements() {
    try {
      this.filterFieldDropdown = document.querySelector(
        DOM_ELEMENTS.FILTER_FIELD_DROPDOWN_SELECTOR,
      );
      this.filterOptionsDropdown = document.querySelector(
        DOM_ELEMENTS.FILTER_FIELD_DROPDOWN_SELECTOR,
      );
      this.sortDropdown = document.querySelector(DOM_ELEMENTS.SORT_DROPDOWN_SELECTOR);
      this.sortOrderToggle = document.querySelector(DOM_ELEMENTS.SORT_ORDER_TOGGLE_SELECTOR);
      this.mainContainer = document.querySelector(DOM_ELEMENTS.MAIN_CONTAINER_SELECTOR);
      this.taskColumns = document.querySelectorAll(DOM_ELEMENTS.TASK_LIST_SELECTOR);
      this.editTaskOverlay = document.getElementById(DOM_ELEMENTS.EDIT_TASK_MODAL_ID);
      this.deleteConfirmationPopup = document.getElementById(
        DOM_ELEMENTS.DELETE_CONFIRMATION_POPUP_ID,
      );
      this.sideNavbar = document.querySelector(DOM_ELEMENTS.SIDE_NAVBAR_SELECTOR);
      this.searchBarTop = document.querySelector(DOM_ELEMENTS.SEARCH_BAR_TOP_SELECTOR);
    } catch (error) {
      this.errorHandler.log(`Error initializing DOM elements: ${error.message}`, 'error');
    }
  }

  bindMethods() {
    const methodToBind = [
      'applyFilters',
      'handleTaskEdit',
      'handleStatusChange',
      'confirmTaskDeletion',
      'handleSearchInput',
      'toggleSortOrder',
    ];

    methodToBind.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

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
      this.setupTaskDelegation();
      this.setupOverlayDelegation();
      this.setupNavigationDelegation();
      this.setupSearchListener();
      this.setupFilterEventListeners();
      this.setupSidebarToggleListener();
    } catch (error) {
      this.errorHandler.log(`Error setting up event listener: ${error.message}`, 'error');
    }
  }

  setupTaskDelegation() {
    // Delegate all task-related events to task columns
    this.taskColumns.forEach((column) => {
      column.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.taskId);
        const task = this.tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Handle status button clicks
        if (e.target.closest('.status-button')) {
          this.handleStatusChange(task);
        }

        // Handle edit button clicks
        if (e.target.closest('.task-edit')) {
          this.handleTaskEdit(taskItem);
        }

        // Handle delete button clicks
        if (e.target.closest('.task-delete')) {
          this.openDeleteConfirmationPopup(taskId, 'main-view');
        }
      });
    });
  }

  setupOverlayDelegation() {
    // Delegate all overlay-related events
    document.querySelector('.app-main').addEventListener('click', (e) => {
      // Create task events
      if (e.target.closest('.board__add-task')) {
        this.handleAddTaskButtonClick();
      }
      if (e.target.closest('.form__button--add')) {
        e.preventDefault();
        this.addTask();
      }

      // form__button--cancel button events
      if (e.target.matches('.form__button--cancel, .modal__close')) {
        const overlay = e.target.closest('.overlay');
        if (overlay.id === DOM_ELEMENTS.CREATE_TASK_MODAL_ID) {
          this.view.closeCreateTaskOverlay();
        } else if (overlay.id === DOM_ELEMENTS.EDIT_TASK_MODAL_ID) {
          this.view.closeEditTaskOverlay();
        }
      }

      // Edit form submission
      if (e.target.matches(DOM_ELEMENTS.EDIT_TASK_BUTTON_SELECTOR)) {
        this.handleEditFormSubmission(e);
      }

      // Mark as completed from edit overlay
      if (e.target.matches('.mark-completed')) {
        const taskId = e.target.closest('.overlay').dataset.taskId;
        const task = this.tasks.find((t) => t.id === parseInt(taskId));
        if (task) {
          task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
          this.renderAllTasks();
          this.saveTasksToLocalStorage();
          this.view.closeEditTaskOverlay();
        }
      }

      // Delete confirmation popup events
      if (e.target.closest('.overlay-delete-button')) {
        const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
        if (!isNaN(taskId)) {
          this.openDeleteConfirmationPopup(taskId, 'edit-overlay');
          this.renderAllTasks();
          this.saveTasksToLocalStorage();
          this.view.closeEditTaskOverlay();
        }
      }
      if (e.target.matches('.confirm-delete-btn')) {
        this.confirmTaskDeletion();
      }
      if (e.target.matches('.cancel-delete-btn, #confirmation-popup--delete .modal__close')) {
        this.closeDeleteConfirmationPopup();
      }
    });
  }

  addTask() {
    const title = document.querySelector('.task-name-input').value.trim();
    const startDate = document.querySelector('#task-start-input').value;
    const endDate = document.querySelector('#task-end-input').value;
    const priority = document
      .querySelector('.form__priority-select .default-option')
      .textContent.trim();
    const category = document
      .querySelector('.form__category-select .default-option')
      .textContent.trim();
    const description = document.querySelector('.textarea-input').value.trim();
    const task = new TaskModel(title, startDate, endDate, description, priority, category);

    if (this.validate(task)) {
      this.tasks.push(task);
      this.saveTasksToLocalStorage();
      this.view.resetCreateTaskForm();
      this.view.closeCreateTaskOverlay();
      this.renderAllTasks();
    }
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

  setupNavigationDelegation() {
    // Delegate navigation events
    document.querySelector('.app__sidebar').addEventListener('click', (e) => {
      if (e.target.closest('.app__nav-link--all-tasks')) {
        this.showAllTasks();
      } else if (e.target.closest('.app__nav-link--dashboard')) {
        this.showDashboard();
      } else if (e.target.closest('.app__nav-link--board-screen')) {
        this.showBoardView();
      } else if (e.target.closest('.app__nav-link--list-screen')) {
        this.showListView();
      }
    });
  }

  // Handler methods
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

  handleEditFormSubmission(e) {
    e.preventDefault();
    const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      title: document.querySelector('#task-title').value.trim(),
      startDate: document.querySelector('#start-date').value,
      endDate: document.querySelector('#end-date').value,
      description: document.querySelector('#textarea').value.trim(),
      priority: document
        .querySelector('#edit-task-modal .form__priority-select .default-option')
        .textContent.trim(),
      category: document
        .querySelector('#edit-task-modal .form__category-select .default-option')
        .textContent.trim(),
      status: document
        .querySelector('#edit-task-modal .form__status-select .default-option')
        .textContent.trim(),
    };
    if (this.validate(updatedTask)) {
      Object.assign(task, updatedTask);
      this.saveTasksToLocalStorage();
      this.renderAllTasks();
      this.view.closeEditTaskOverlay();
    }
  }
  showAllTasks() {
    document.getElementById('all-task-modal').classList.remove('hidden');
    this.toggleResponsiveView();
  }

  showDashboard() {
    document.getElementById('all-task-modal').classList.add('hidden');
    this.toggleResponsiveView();
  }

  showBoardView() {
    document.querySelector('.board-view').classList.remove('hidden');
    document.querySelector('.list-view').classList.add('hidden');
    this.toggleResponsiveView();
  }

  showListView() {
    document.querySelector('.list-view').classList.remove('hidden');
    document.querySelector('.board-view').classList.add('hidden');
    this.toggleResponsiveView();
  }

  toggleResponsiveView() {
    if (window.innerWidth < 800) {
      document.querySelector('.app__sidebar').classList.toggle('active');
      document.querySelector('.app-main').classList.toggle('active');
    }
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

  //Search event
  setupSearchListener() {
    ['.input-bar__main-input', '#all-task-modal .input-bar-mini__main-input'].forEach(
      (selector) => {
        const inputElement = document.querySelector(selector);
        if (inputElement) {
          inputElement.addEventListener('input', this.handleSearchInput.bind(this));
        }
      },
    );
  }

  //Search tasks method
  handleSearchInput(e) {
    const searchText = e.target.value.toLowerCase().trim();
    const isPopupSearch = e.target.closest('#all-task-modal') !== null;
    const filteredTasks = searchText ? this.searchTasks(searchText) : this.tasks;

    isPopupSearch
      ? this.view.renderAllTasksPopup(filteredTasks)
      : this.view.renderTasks(filteredTasks);
  }
  //check if having at least one field matched the search text
  searchTasks(searchText) {
    return this.tasks.filter((task) =>
      ['title', 'description', 'category', 'priority'].some((field) =>
        task[field].toLowerCase().includes(searchText),
      ),
    );
  }

  //Setup filter event listeners for filtering and sorting
  setupFilterEventListeners() {
    // Apply event listeners to filters

    this.populateFilterOptions('category');

    filterFieldDropdown.addEventListener('change', (e) => {
      this.populateFilterOptions(e.target.value);
    });
    if (this.filterOptionsDropdown) {
      filterOptionsDropdown.addEventListener('change', this.applyFilters.bind(this));
    }

    const searchInputs = document.querySelectorAll('.input-bar-mini__main-input');
    searchInputs.forEach((input) => {
      input.addEventListener('input', this.applyFilters.bind(this));
    });
    //for sorting event listeners
    if (this.sortDropdown) {
      this.sortDropdown.addEventListener('change', this.applyFilters.bind(this));
    }
    if (this.sortOrderToggle) {
      this.sortOrderToggle.removeEventListener('click', this.toggleSortOrderHandler);
      this.toggleSortOrderHandler = this.toggleSortOrder.bind(this);
      this.sortOrderToggle.addEventListener('click', this.toggleSortOrderHandler);
    }
  }

  // Populate the second dropdown based on the first chosen dropdown
  populateFilterOptions(field) {
    const filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
    filterOptionsDropdown.innerHTML = '';

    const options =
      {
        category: ['All', 'Daily Task', 'Weekly Task', 'Monthly Task'],
        priority: ['All', 'Not Urgent', 'Urgent Task', 'Important'],
        status: ['All', 'To Do', 'In Progress', 'Completed'],
      }[field] || [];

    // Populate filter options
    filterOptionsDropdown.innerHTML = options
      .map((opt) => `<option value="${opt}">${opt}</option>`)
      .join('');
  }

  //Apply filters
  applyFilters() {
    const filterField = filterFieldDropdown ? filterFieldDropdown.value : 'category';
    const filterValue = filterOptionsDropdown ? filterOptionsDropdown.value : 'All';
    const searchInput = document.querySelector('.input-bar-mini__main-input');
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filterOptions = {
      [filterField === 'status'
        ? 'status'
        : filterField === 'priority'
          ? 'priority'
          : filterField === 'category'
            ? 'category'
            : 'All']: filterValue,
      searchText: searchText,
    };

    //Filter tasks
    const filteredTasks = this.filterTask(filterOptions);
    this.view.renderAllTasksPopup(filteredTasks);
  }

  //filter task method
  filterTask(options = {}) {
    const { category = 'All', priority = 'All', status = 'All', searchText = '' } = options;

    let filteredTasks = this.tasks;
    if (searchText) {
      filteredTasks = filteredTasks.filter((task) =>
        ['title', 'description', 'category', 'priority'].some((field) =>
          task[field]?.toLowerCase().includes(searchText),
        ),
      );
    }
    // Filter by category
    if (category !== 'All') {
      filteredTasks = filteredTasks.filter(
        (task) => task.category.toLowerCase() === category.toLowerCase(),
      );
    }
    //Filer by priority
    if (priority !== 'All') {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority.toLowerCase() === priority.toLowerCase(),
      );
    }
    //Filter by status
    if (status !== 'All') {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }
    return filteredTasks;
  }

  //Sort task method
  sortTasks(field, order = 'asc') {
    //validate input
    const validFields = ['name', 'startDate', 'endDate', 'category', 'priority'];
    if (!validFields.includes(field)) {
      this.showError(`Invalid sort criteria. Please choose one of: ${validFields.join(', ')}`);

      return this.tasks;
    }
    // Sort handling method:
    const getSortValue = (task, field) => {
      const sortMap = {
        name: task.title?.toLowerCase() || '',
        startDate: new Date(task.startDate || '9999-12-31'),
        endDate: new Date(task.endDate || '9999-12-31'),
        category: task.category?.toLowerCase() || '',
        priority:
          {
            'Not urgent': 1,
            'Urgent Task': 2,
            Important: 3,
          }[task.priority] || 0,
      };
      return sortMap[field];
    };

    const sortedTasks = [...this.tasks].sort((a, b) => {
      const valueA = getSortValue(a, field);
      const valueB = getSortValue(b, field);

      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    this.currentSortSetting = { field, order };
    return sortedTasks;
  }

  //change sort order state
  toggleSortOrder(e) {
    e.stopPropagation();

    const currentOrder = this.currentSortSetting.order;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    //update sort order
    this.currentSortSetting.order = newOrder;
    const sortField = this.sortDropdown.value;
    const sortedTasks = this.sortTasks(sortField, newOrder);
    this.view.renderAllTasksPopup(sortedTasks);

    //update button visual state
    this.sortOrderToggle.innerHTML =
      newOrder === SORT_SETTING.SORT_ORDER_ASC
        ? ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" />'
        : ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-desc.png" alt="sort-icon-down" />';
  }
}
export default TaskController;
