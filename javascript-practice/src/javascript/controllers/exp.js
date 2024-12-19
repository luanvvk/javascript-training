import TaskModel from '../models/task-model.js';
import TaskView from '../view/app-view.js';
import ValidationUtils from '../helpers/validation-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import ErrorHandler from '../helpers/error-handler-utils.js';

import { showDeletionNotification } from '../helpers/notifications.js';
import {
  createFormElements,
  editFormElements,
  setupPopupDropdowns,
  renderSortingUI,
} from '../templates/templates.js';

//Declaration
// filter criteria
const filterFieldDropdown = document.querySelector('.filter-field-dropdown');
const filterOptionsDropdown = document.querySelector('.filter-options-dropdown');
//sort
const sortDropdown = document.querySelector('.sort-dropdown');
const sortOrderToggle = document.querySelector('.sort-order-toggle');
//navigate/toggle elements
const popupBoardView = document.querySelector('#all-task-popup .board-view');
const popupListView = document.querySelector('#all-task-popup .list-view');
const boardViewOption = document.querySelector('.app__nav-link.app__nav-link--board-screen');
const listViewOption = document.querySelector('.app__nav-link.app__nav-link--list-screen');
const listView = document.querySelector('.list-view');
const boardView = document.querySelector('.board-view');
const editTask = document.getElementById('edit-task-overlay');
const createTask = document.getElementById('create-task-overlay');
//sidebar toggle elements
const dashboardBtn = document.querySelector('.app__nav-link.app__nav-link--dashboard');
const searchBarTop = document.querySelector('.search-bar__input-bar');
const allTaskPopup = document.getElementById('all-task-popup');
const allTaskBtn = document.querySelector('.app__nav-link.app__nav-link--all-tasks');
const toggle = document.querySelector('.menu-bar-toggle');
const sideNavbar = document.querySelector('.app__sidebar');
const mainBody = document.querySelector('.app-main');
const appLogoHeading = document.querySelector('.app__logo-text');
const appLogo = document.querySelector('.app-logo');

class TaskController {
  constructor() {
    this.model = new TaskModel();
    this.view = new TaskView();
    this.tasks = [];
    this.localStorageUtil = new LocalStorageUtil();
    this.validationUtils = new ValidationUtils();
    this.errorHandler = new ErrorHandler();
    this.currentSortSetting = {
      field: 'name',
      order: 'asc',
    };
    this.filterFieldDropdown = document.querySelector('.filter-field-dropdown');
    this.filterOptionsDropdown = document.querySelector('.filter-options-dropdown');
    this.sortDropdown = document.querySelector('.sort-dropdown');
    this.sortOrderToggle = document.querySelector('.sort-order-toggle');
    this.mainContainer = document.querySelector('.app-main');
    this.taskColumns = document.querySelectorAll('.task-list');
    this.editTaskOverlay = document.getElementById('edit-task-overlay');
    this.overlayContainer = document.querySelector('.app-wrapper');
    this.deleteConfirmationPopup = document.getElementById('delete-confirmation-popup');
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;
    this.applyFilters = this.applyFilters.bind(this);
    // Bind methods
    this.handleTaskEdit = this.handleTaskEdit.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.confirmTaskDeletion = this.confirmTaskDeletion.bind(this);
    this.initialize();
  }

  initialize() {
    this.loadTasksFromLocalStorage();
    this.setupDynamicForm();
    this.setupEventListeners();
    this.setupFilterEventListeners();
    this.renderAllTasks();
    renderSortingUI();
  }

  loadTasksFromLocalStorage() {
    this.tasks = this.localStorageUtil.load(TaskModel);
  }

  saveTasksToLocalStorage() {
    this.localStorageUtil.save(this.tasks);
  }

  validate(task) {
    const validationErrors = this.validationUtils.validateTask(task);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => this.showError(error));
      return false;
    }
    return true;
  }

  showError(message) {
    this.errorHandler.showError(message);
  }

  setupDynamicForm() {
    createFormElements();
    setupPopupDropdowns();
    editFormElements();
  }

  setupEventListeners() {
    this.setupTaskDelegation();
    this.setupOverlayDelegation();
    this.setupNavigationDelegation();
    this.setupSearchListener();
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
      if (e.target.closest('.add-a-task')) {
        this.handleAddTaskButtonClick();
      }
      if (e.target.closest('.button-controls .add-to-list')) {
        e.preventDefault();
        this.addTask();
      }

      // Cancel button events
      if (e.target.matches('.cancel, .close-popup')) {
        const overlay = e.target.closest('.overlay');
        if (overlay.id === 'create-task-overlay') {
          this.view.closeCreateTaskOverlay();
        } else if (overlay.id === 'edit-task-overlay') {
          this.view.closeEditTaskOverlay();
        }
      }

      // Edit form submission
      if (e.target.matches('.edit-task-button')) {
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
      } else {
        console.log('Invalid task ID');
      }
      if (e.target.matches('.confirm-delete-btn')) {
        this.confirmTaskDeletion();
      }
      if (e.target.matches('.cancel-delete-btn, #delete-confirmation-popup .close-popup')) {
        this.closeDeleteConfirmationPopup();
      }
    });
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
    if (!taskElement) {
      console.error('No task element provided to handleTaskEdit');
      return;
    }
    const taskId = parseInt(taskElement.dataset.taskId);
    if (isNaN(taskId)) {
      console.error('Invalid task ID:', taskElement.dataset.taskId);
      return;
    }

    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      setupPopupDropdowns(task);
      this.view.populateEditForm(task);
      this.view.openEditTaskOverlay();
      this.editTaskOverlay.dataset.taskId = taskId;
    } else {
      console.log('Task not found');
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
        .querySelector('#edit-task-overlay .priority-select .default-option')
        .textContent.trim(),
      category: document
        .querySelector('#edit-task-overlay .category-select .default-option')
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
    const allTaskPopup = document.getElementById('all-task-popup');
    allTaskPopup.classList.remove('hide');
    const width = window.matchMedia('(min-width: 800px)');
    if (width.matches) {
      document.querySelector('.search-bar__input-bar').classList.toggle('hide');
    } else {
      this.mainContainer.classList.toggle('active');
      document.querySelector('.app__sidebar').classList.toggle('active');
    }
  }

  handleDashboardNavigation() {
    allTaskPopup.classList.add('hide');
    searchBarTop.classList.remove('hide');
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
      listView.classList.add('hide');
      boardView.classList.remove('hide');
    } else {
      listView.classList.remove('hide');
      boardView.classList.add('hide');
    }
  }
  switchPopupView(viewType) {
    if (viewType === 'board') {
      popupBoardView.classList.remove('hide');
      popupListView.classList.add('hide');
    } else {
      popupBoardView.classList.add('hide');
      popupListView.classList.remove('hide');
    }
  }

  //Search event
  setupSearchListener() {
    const mainSearchInput = document.querySelector('.input-bar__main-input');
    const popupSearchInput = document.querySelector('#all-task-popup .input-bar-mini__main-input');

    if (mainSearchInput) {
      mainSearchInput.addEventListener('input', this.searchTasks.bind(this));
    }
    if (popupSearchInput) {
      popupSearchInput.addEventListener('input', this.searchTasks.bind(this));
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

  // Task Management Methods
  addTask() {
    const title = document.querySelector('.task-name-input').value.trim();
    const startDate = document.querySelector('#task-start-input').value;
    const endDate = document.querySelector('#task-end-input').value;
    const priority = document.querySelector('.priority-select .default-option').textContent.trim();
    const category = document.querySelector('.category-select .default-option').textContent.trim();
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

  openDeleteConfirmationPopup(taskId, origin) {
    console.log(`Opening delete confirmation for task ID: ${taskId}, origin: ${origin}`);
    this.pendingTaskToDelete = taskId;
    this.deleteOrigin = origin;
    // Show the confirmation popup
    this.deleteConfirmationPopup.classList.remove('hide');
    document.body.classList.add('overflow-hidden');
  }

  closeDeleteConfirmationPopup() {
    this.deleteConfirmationPopup.classList.add('hide');
    document.body.classList.add('overflow-hidden');
    // Reset pending deletion info
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;
  }
  confirmTaskDeletion() {
    console.log(
      `Confirming deletion for task ID: ${this.pendingTaskToDelete}, origin: ${this.deleteOrigin}`,
    );
    if (this.pendingTaskIdToDelete === null) {
      console.error('No task ID is set for deletion');
      return;
    }
    this.tasks = this.tasks.filter((t) => t.id !== this.pendingTaskToDelete);
    showDeletionNotification();
    this.renderAllTasks();
    this.saveTasksToLocalStorage();
    this.closeDeleteConfirmationPopup();

    if (this.deleteOrigin === 'all-task-popup') {
      const allTaskPopup = document.getElementById('all-task-popup');
      allTaskPopup.classList.remove('hide');
    }
    console.log(`Task deleted. Remaining tasks: ${this.tasks.length}`);
  }
  renderAllTasks() {
    // Render all tasks in the All Tasks Popup,
    this.view.renderAllTasksPopup(this.tasks);
    // Render all tasks in the main view
    this.view.renderTasks(this.tasks);
  }

  //Search tasks method
  searchTasks(e) {
    const searchText = e.target.value.toLowerCase().trim();
    const isPopupSearch = e.target.closest('#all-task-popup') !== null;
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

  //Setup filter event listeners for filtering and sorting
  setupFilterEventListeners() {
    // Apply event listeners to filters
    if (!this.filterFieldDropdown || !this.filterOptionsDropdown) {
      console.error('Filter dropdowns not found');
      return;
    }
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
    } else {
      console.error('Sort order toggle button not found');
      console.log('sort order toggle', this.sortOrderToggle);
      console.log('sort field', sortField);
    }
  }

  // Populate the second dropdown based on the first chosen dropdown
  populateFilterOptions(field) {
    const filterOptionsDropdown = document.querySelector('.filter-options-dropdown');
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

    console.log('Filter Options:', filterOptions);

    //Filter tasks
    const filteredTasks = this.filterTask(filterOptions);
    this.view.renderAllTasksPopup(filteredTasks);
    this.view.renderTasks(filteredTasks);
  }

  //Sort task method
  sortTasks(field, order = 'asc') {
    //validate input
    const validFields = ['name', 'startDate', 'endDate', 'category', 'priority'];
    if (!validFields.includes(field)) {
      this.showError(`Invalid sort criteria. Please choose one of: ${validFields.join(', ')}`);
      console.error(`Invalid sort field: ${field}`);
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
          const priorityOrder = {
            'Not urgent': 1,
            'Urgent Task': 2,
            Important: 3,
          };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
      }
      //sort conditions
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    this.currentSortSetting = { field, order };
    console.log('Current Sort Setting:', { field, order });
    return sortedTasks;
  }

  //change sort order state
  toggleSortOrder(e) {
    e.stopPropagation();
    console.log('toggleSortOrder fired');

    const currentOrder = this.currentSortSetting.order;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    //update sort order
    this.currentSortSetting.order = newOrder;
    const sortField = this.sortDropdown.value;
    const sortedTasks = this.sortTasks(sortField, newOrder);
    console.log('Sorted Tasks:', sortedTasks);
    this.view.renderTasks(sortedTasks);
    this.view.renderAllTasksPopup(sortedTasks);

    //update button visual state
    sortOrderToggle.innerHTML =
      newOrder === 'asc'
        ? ' <img class="sort-icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" />'
        : ' <img class="sort-icon" src="./assets/images/icons/sort-icons/sort-icon-desc.png" alt="sort-icon-down" />';
    console.log('Sort Order Toggle Updated HTML:', sortOrderToggle.innerHTML);
  }
}
export default TaskController;
