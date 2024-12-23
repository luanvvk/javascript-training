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
//sort
const sortOrderToggle = document.querySelector(DOM_ELEMENTS.SORT_ORDER_TOGGLE_SELECTOR);
//navigate/toggle elements
const popupBoardView = document.querySelector('#all-task-modal .board-view');
const popupListView = document.querySelector('#all-task-modal .list-view');
const listView = document.querySelector('.list-view');
const boardView = document.querySelector('.board-view');
//sidebar toggle elements
const searchBarTop = document.querySelector(DOM_ELEMENTS.SEARCH_BAR_TOP_SELECTOR);
const allTaskPopup = document.getElementById('all-task-modal');
const toggle = document.querySelector('.topbar__menu-toggle');
const sideNavbar = document.querySelector(DOM_ELEMENTS.SIDE_NAVBAR_SELECTOR);
const mainBody = document.querySelector(DOM_ELEMENTS.MAIN_CONTAINER_SELECTOR);
const appLogoHeading = document.querySelector('.app__logo-text');
const TASK_STORAGE_KEY = 'tasks';

class TaskController {
  constructor() {
    this.initializeProperties();
    this.bindMethods();
    this.initialize();
  }

  initializeProperties() {
    this.model = new TaskModel();
    this.view = new TaskView();
    this.tasks = [];
    this.localStorageUtil = new LocalStorageUtil(TASK_STORAGE_KEY);
    this.validationUtils = new ValidationUtils();
    this.errorHandler = new ErrorHandler();
    this.currentSortSetting = {
      field: SORT_SETTING.FIELD,
      order: SORT_SETTING.SORT_ORDER_ASC,
    };
    this.TASK_STORAGE_KEY = 'tasks';
    this.sortField = '';
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
    this.applyFilters = this.applyFilters.bind(this);
    this.handleTaskEdit = this.handleTaskEdit.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.confirmTaskDeletion = this.confirmTaskDeletion.bind(this);
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
    createFormElements();
    setupPopupDropdowns();
    renderSortingUI();
  }

  setupEventListeners() {
    this.setupTaskDelegation();
    this.setupOverlayDelegation();
    this.setupNavigationDelegation();
    this.setupSearchListener();
    this.setupFilterEventListeners();
    this.setupFilterEventListeners();
    this.setupSidebarToggleListener();
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
        if (e.target.closest(DOM_ELEMENTS.TASK_DELETE_SELECTOR)) {
          this.openDeleteConfirmationPopup(taskId, 'main-view');
        }
      });
    });
  }

  setupOverlayDelegation() {
    // Delegate all overlay-related events
    document.querySelector(DOM_ELEMENTS.APP_MAIN_SELECTOR).addEventListener('click', (e) => {
      // Create task events
      if (e.target.closest(DOM_ELEMENTS.BOARD_ADD_TASK_SELECTOR)) {
        this.handleAddTaskButtonClick();
      }
      if (e.target.closest(DOM_ELEMENTS.FORM_ADD_BUTTON_SELECTOR)) {
        e.preventDefault();
        this.addTask();
      }

      // form__button--cancel button events
      if (e.target.matches(DOM_ELEMENTS.FORM_CANCEL_BUTTON_SELECTOR)) {
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
      this.renderTasks();
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
        this.handleAllTasksNavigation();
      } else if (e.target.closest('.app__nav-link--dashboard')) {
        this.handleDashboardNavigation();
      } else if (e.target.closest('.app__nav-link--board-screen')) {
        this.handleBoardViewNavigation();
      } else if (e.target.closest('.app__nav-link--list-screen')) {
        this.handleListViewNavigation();
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
      description: document.querySelector('.textarea-input').value.trim(),
      priority: document
        .querySelector('#edit-task-modal .form__priority-select .default-option')
        .textContent.trim(),
      category: document
        .querySelector('#edit-task-modal .form__category-select .default-option')
        .textContent.trim(),
    };
    if (this.validate(updatedTask)) {
      Object.assign(task, updatedTask);
      this.saveTasksToLocalStorage();
      this.renderAllTasks();
      this.view.closeEditTaskOverlay();
    }
  }

  handleAllTasksNavigation() {
    const allTaskPopup = document.getElementById('all-task-modal');
    allTaskPopup.classList.remove('hidden');
    const width = window.matchMedia('(min-width: 800px)');
    if (width.matches) {
      document.querySelector('.search-bar__input-bar').classList.toggle('hidden');
    } else {
      this.mainContainer.classList.toggle('active');
      document.querySelector('.app__sidebar').classList.toggle('active');
    }
  }

  handleDashboardNavigation() {
    allTaskPopup.classList.add('hidden');
    searchBarTop.classList.remove('hidden');
    this.view.closeCreateTaskOverlay();
    let width = window.matchMedia('(min-width: 800px)');
    if (!width.matches) {
      mainBody.classList.toggle('active');
      sideNavbar.classList.toggle('active');
    }
  }

  handleBoardViewNavigation() {
    this.switchToView('board');
    this.switchPopupView('board');
    let width = window.matchMedia('(min-width: 800px)');
    if (!width.matches) {
      sideNavbar.classList.toggle('active');
      mainBody.classList.toggle('active');
    }
  }
  handleListViewNavigation() {
    this.switchToView('list');
    this.switchPopupView('list');
    let width = window.matchMedia('(min-width: 800px)');
    if (!width.matches) {
      sideNavbar.classList.toggle('active');
      mainBody.classList.toggle('active');
    }
  }

  switchToView(viewType) {
    if (viewType === 'board') {
      listView.classList.add('hidden');
      boardView.classList.remove('hidden');
    } else {
      listView.classList.remove('hidden');
      boardView.classList.add('hidden');
    }
  }

  switchPopupView(viewType) {
    if (viewType === 'board') {
      popupBoardView.classList.remove('hidden');
      popupListView.classList.add('hidden');
    } else {
      popupBoardView.classList.add('hidden');
      popupListView.classList.remove('hidden');
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

  //Search event
  setupSearchListener() {
    const mainSearchInput = document.querySelector('.input-bar__main-input');
    const popupSearchInput = document.querySelector('#all-task-modal .input-bar-mini__main-input');

    if (mainSearchInput) {
      mainSearchInput.addEventListener('input', this.searchTasks.bind(this));
    }
    if (popupSearchInput) {
      popupSearchInput.addEventListener('input', this.searchTasks.bind(this));
    }
  }

  //Search tasks method
  searchTasks(e) {
    const searchText = e.target.value.toLowerCase().trim();
    const isPopupSearch = e.target.closest('#all-task-modal') !== null;
    // If search is empty, render all tasks
    if (searchText === '') {
      if (isPopupSearch) {
        this.view.renderAllTasksPopup(this.tasks);
      } else {
        this.renderTasks();
      }
      return;
    }

    // Filter tasks based on search criteria
    const filteredTasks = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchText) ||
        task.description.toLowerCase().includes(searchText) ||
        task.category.toLowerCase().includes(searchText) ||
        task.priority.toLowerCase().includes(searchText),
    );

    // Render filtered tasks
    if (isPopupSearch) {
      this.view.renderAllTasksPopup(filteredTasks);
    } else {
      this.view.renderTasks(filteredTasks);
    }
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

    let options = [];
    switch (field) {
      case 'category':
        options = ['All', 'Daily Task', 'Weekly Task', 'Monthly Task'];
        break;
      case 'priority':
        options = ['All', 'Not Urgent', 'Urgent Task', 'Important'];
        break;
      case 'status':
        options = ['All', 'To Do', 'In Progress', 'Completed'];
        break;
      default:
        options = ['All'];
    }

    // Populate filter options
    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      filterOptionsDropdown.appendChild(optionElement);
    });
    // Re-apply filters with default "All"
    this.applyFilters();
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
    this.view.renderTasks(filteredTasks);
  }

  //filter task method
  filterTask(options = {}) {
    const { category = 'All', priority = 'All', status = 'All', searchText = '' } = options;

    let filteredTasks = this.tasks;
    if (searchText) {
      filteredTasks = filteredTasks.filter((task) => {
        const matchedResult =
          task.title.toLowerCase().includes(searchText) ||
          task.description.toLowerCase().includes(searchText) ||
          task.category.toLowerCase().includes(searchText) ||
          task.priority.toLowerCase().includes(searchText);
        return matchedResult;
      });
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
    //avoid mutating the original array
    const sortedTasks = [...this.tasks].sort((a, b) => {
      let valueA, valueB;
      switch (field) {
        case 'name':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'startDate':
          valueA = a.startDate ? new Date(a.startDate) : new Date(9999, 12, 31);
          valueB = b.startDate ? new Date(b.startDate) : new Date(9999, 12, 31);
          break;
        case 'endDate':
          valueA = a.endDate ? new Date(a.endDate) : new Date(9999, 12, 31);
          valueB = b.endDate ? new Date(b.endDate) : new Date(9999, 12, 31);
          break;
        case 'category':
          valueA = a.category.toLowerCase();
          valueB = b.category.toLowerCase();
          break;
        case 'priority':
          {
            const priorityOrder = {
              'Not urgent': 1,
              'Urgent Task': 2,
              Important: 3,
            };
            valueA = priorityOrder[a.priority] || 0;
            valueB = priorityOrder[b.priority] || 0;
          }

          break;
      }
      //sort conditions
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
    const newOrder =
      currentOrder === SORT_SETTING.SORT_ORDER_ASC
        ? SORT_SETTING.SORT_ORDER_DESC
        : SORT_SETTING.SORT_ORDER_ASC;
    //update sort order
    this.currentSortSetting.order = newOrder;
    const sortField = this.sortDropdown.value;
    const sortedTasks = this.sortTasks(sortField, newOrder);

    this.view.renderTasks(sortedTasks);
    this.view.renderAllTasksPopup(sortedTasks);

    //update button visual state
    sortOrderToggle.innerHTML =
      newOrder === SORT_SETTING.SORT_ORDER_ASC
        ? ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" />'
        : ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-desc.png" alt="sort-icon-down" />';
  }
}
export default TaskController;
