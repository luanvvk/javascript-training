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
const filterFieldDropdown = document.querySelector('.filter__field-dropdown');
const filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
//sort
const sortDropdown = document.querySelector('.sort__dropdown');
const sortOrderToggle = document.querySelector('.sort__order-toggle');
//navigate/toggle elements
const popupBoardView = document.querySelector('#all-task-modal .board-view');
const popupListView = document.querySelector('#all-task-modal .list-view');
const boardViewOption = document.querySelector('.app__nav-link.app__nav-link--board-screen');
const listViewOption = document.querySelector('.app__nav-link.app__nav-link--list-screen');
const listView = document.querySelector('.list-view');
const boardView = document.querySelector('.board-view');
const editTask = document.getElementById('edit-task-modal');
const createTask = document.getElementById('create-task-modal');
//sidebar toggle elements
const dashboardBtn = document.querySelector('.app__nav-link.app__nav-link--dashboard');
const searchBarTop = document.querySelector('.search-bar__input-bar');
const allTaskPopup = document.getElementById('all-task-modal');
const allTaskBtn = document.querySelector('.app__nav-link.app__nav-link--all-tasks');
const toggle = document.querySelector('.topbar__menu-toggle');
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
    this.deleteConfirmationPopup = null;
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;
    this.setupDeleteConfirmationPopup();
    this.applyFilters = this.applyFilters.bind(this);
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
    this.setupAddTaskListener();
    this.setupCancelButtonListeners();
    this.setupSearchListener();
    this.setupNavigationListener();
    this.setupSidebarToggleListener();
    this.setupResponsiveDesignListener();
  }

  // Add task event
  setupAddTaskListener() {
    const addTaskBtns = document.querySelectorAll('.board__add-task');
    const addToListButton = document.querySelector(
      '.form__actions .form__button.form__button--add',
    );
    addTaskBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.handleAddTaskButtonClick();
      });
    });
    if (addToListButton) {
      addToListButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.addTask();
      });
    }
  }

  handleAddTaskButtonClick() {
    this.view.openCreateTaskOverlay();
    mainBody.classList.remove('active');
    sideNavbar.classList.remove('active');
  }

  //Cancel event
  setupCancelButtonListeners() {
    const cancelCreateButtons = document.querySelectorAll('#create-task-modal .cancel');
    const cancelEditButtons = document.querySelectorAll('#edit-task-modal .cancel');
    const closeCreatePopupBtns = document.querySelectorAll('#create-task-modal .modal__close');
    const closeEditPopupBtns = document.querySelectorAll('#edit-task-modal .modal__close');

    cancelCreateButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.view.closeCreateTaskOverlay();
      });
    });
    cancelEditButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.view.closeEditTaskOverlay();
      });
    });
    closeCreatePopupBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.view.closeCreateTaskOverlay();
      });
    });
    closeEditPopupBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.view.closeEditTaskOverlay();
      });
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

  // Events for all all task popup, dashboard, main body, and view
  setupNavigationListener() {
    allTaskBtn.addEventListener('click', () => {
      allTaskPopup.classList.remove('hidden');
      let width = window.matchMedia('(min-width: 800px)');
      if (width.matches) {
        searchBarTop.classList.toggle('hidden');
      } else {
        mainBody.classList.toggle('active');
        sideNavbar.classList.toggle('active');
      }
    });

    dashboardBtn.addEventListener('click', () => {
      allTaskPopup.classList.add('hidden');
      searchBarTop.classList.remove('hidden');
      this.view.closeCreateTaskOverlay();
      let width = window.matchMedia('(min-width: 800px)');
      if (!width.matches) {
        mainBody.classList.toggle('active');
        sideNavbar.classList.toggle('active');
      }
    });
    // handle both views in all task popup and dashboard
    boardViewOption.addEventListener('click', () => {
      this.switchToView('board');
      this.switchPopupView('board');
      let width = window.matchMedia('(min-width: 800px)');
      if (!width.matches) {
        sideNavbar.classList.toggle('active');
        mainBody.classList.toggle('active');
      }
    });

    listViewOption.addEventListener('click', () => {
      this.switchToView('list');
      this.switchPopupView('list');
      let width = window.matchMedia('(min-width: 800px)');
      if (!width.matches) {
        sideNavbar.classList.toggle('active');
        mainBody.classList.toggle('active');
      }
    });
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
    this.setupTaskActions();
  }

  setupTaskActions() {
    const taskElements = document.querySelectorAll('.task-item');
    const allTaskPopup = document.getElementById('all-task-modal');
    taskElements.forEach((taskElement) => {
      const taskId = parseInt(taskElement.dataset.taskId);
      const task = this.tasks.find((t) => t.id === taskId);
      if (!task) return;
      // Handle status button
      taskElement.querySelector('.status-button').addEventListener('click', () => {
        if (task.status === 'To Do') {
          task.status = 'In Progress'; //change status to running
        } else if (task.status === 'In Progress') {
          task.status = 'Completed'; //change status to completed
        } else if (task.status === 'Completed') {
          task.status = 'In Progress'; //change status back to running
        }
        this.renderAllTasks();
        this.saveTasksToLocalStorage();
      });

      // Edit Task
      taskElement.querySelector('.task-edit').addEventListener('click', () => {
        setupPopupDropdowns(task);
        this.view.populateEditForm(task);
        this.view.openEditTaskOverlay();

        const editDeleteButton = document.querySelector('.overlay-delete-button');
        editDeleteButton.dataset.taskId = taskId;

        // Save edit
        const editTaskButton = document.querySelector('.edit-task-button');

        editTaskButton.onclick = () => {
          task.title = document.querySelector('#task-title').value.trim();
          task.startDate = document.querySelector('#start-date').value;
          task.endDate = document.querySelector('#end-date').value;
          task.description = document.querySelector('.textarea-input').value.trim();
          task.priority = document
            .querySelector('#edit-task-modal .form__priority-select .default-option')
            .textContent.trim();
          task.category = document
            .querySelector('#edit-task-modal .category-select .default-option')
            .textContent.trim();

          // Validate task

          if (this.validate(task)) {
            this.saveTasksToLocalStorage();
            this.renderAllTasks();
            this.view.closeEditTaskOverlay();
            // Check if edit is performed in "All Tasks" popup
            const isAllTaskPopupOpen = !allTaskPopup.classList.contains('hidden');
            if (isAllTaskPopupOpen) {
              allTaskPopup.classList.remove('hidden');
            }
          }
        };
        // Mark as Completed in edit overlay
        const markCompletedButton = document.querySelector('.form__actions .mark-completed');

        markCompletedButton.onclick = () => {
          task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
          this.renderAllTasks();
          this.saveTasksToLocalStorage();
          this.view.closeEditTaskOverlay();
        };
      });
      // Delete Task
      const deleteButton = taskElement.querySelector('.task-delete');
      if (deleteButton) {
        deleteButton.removeEventListener('click', this.handleDeleteTask); // Prevent duplicate listeners
        deleteButton.addEventListener('click', () => {
          console.log(`Delete button clicked for task ID: ${taskId}`);

          this.openDeleteConfirmationPopup(taskId, 'main-view'); // Pass origin if needed
        });
      }
    });

    const editDeleteButton = document.querySelector('.overlay-delete-button');
    editDeleteButton.addEventListener('click', () => {
      const taskId = parseInt(editDeleteButton.dataset.taskId);
      this.openDeleteConfirmationPopup(taskId, 'edit-overlay');
      this.renderAllTasks();
      this.saveTasksToLocalStorage();
      this.view.closeEditTaskOverlay();
    });
    console.log(`Attaching delete listeners. Task count: ${taskElements.length}`);
  }

  setupDeleteConfirmationPopup() {
    this.deleteConfirmationPopup = document.getElementById('confirmation-popup--delete');
    if (!this.deleteConfirmationPopup) {
      console.error('Delete confirmation popup not found');
      return;
    }

    const closePopupButtons = this.deleteConfirmationPopup.querySelectorAll(
      '.modal__close, .cancel-delete-btn',
    );
    const confirmDeleteButton = this.deleteConfirmationPopup.querySelector('.confirm-delete-btn');

    closePopupButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeDeleteConfirmationPopup();
      });
    });
    confirmDeleteButton.addEventListener('click', () => this.confirmTaskDeletion());
  }
  openDeleteConfirmationPopup(taskId, origin) {
    console.log(`Opening delete confirmation for task ID: ${taskId}, origin: ${origin}`);
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

    if (this.deleteOrigin === 'all-task-modal') {
      const allTaskPopup = document.getElementById('all-task-modal');
      allTaskPopup.classList.remove('hidden');
    }
    console.log(`Task deleted. Remaining tasks: ${this.tasks.length}`);
  }
  renderAllTasks() {
    // Render all tasks in the All Tasks Popup,
    this.view.renderAllTasksPopup(this.tasks);
    // Render all tasks in the main view
    this.view.renderTasks(this.tasks);
    this.setupTaskActions();
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
      this.setupTaskActions();
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
    if (filterFieldDropdown) {
      filterFieldDropdown.addEventListener('change', (e) => {
        this.populateFilterOptions(e.target.value);
      });
    }
    if (filterOptionsDropdown) {
      filterOptionsDropdown.addEventListener('change', this.applyFilters.bind(this));
    }

    const searchInputs = document.querySelectorAll('.input-bar-mini__main-input');
    searchInputs.forEach((input) => {
      input.addEventListener('input', this.applyFilters.bind(this));
    });
    //for sorting event listeners
    if (sortDropdown) {
      sortDropdown.addEventListener('change', this.applyFilters.bind(this));
    }
    if (sortOrderToggle) {
      sortOrderToggle.addEventListener('click', this.toggleSortOrder.bind(this));
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

    console.log('Filter Options:', filterOptions);

    //Filter tasks
    const filteredTasks = this.filterTask(filterOptions);
    this.view.renderAllTasksPopup(filteredTasks);
    this.view.renderTasks(filteredTasks);
    this.setupTaskActions();
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
    return sortedTasks;
  }

  //change sort order state
  toggleSortOrder() {
    const currentOrder = this.currentSortSetting.order;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    //update sort order
    this.currentSortSetting.order = newOrder;
    const sortField = sortDropdown.value;
    const sortedTasks = this.sortTasks(sortField, newOrder);
    this.view.renderTasks(sortedTasks);
    this.view.renderAllTasksPopup(sortedTasks);
    this.setupTaskActions();
    //update button visual state
    sortOrderToggle.innerHTML =
      newOrder === 'asc'
        ? ' <img class="sort-icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" />'
        : ' <img class="sort-icon" src="./assets/images/icons/sort-icons/sort-icon-desc.png" alt="sort-icon-down" />';
  }
}
export default TaskController;