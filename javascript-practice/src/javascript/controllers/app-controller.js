import TaskModel from '../models/task-model.js';
import TaskView from '../view/app-view.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import { showError } from '../helpers/error-handling.js';
import { showDeletionNotification } from '../helpers/notifications.js';
import { createFormElements } from '../templates/create-task-popup.js';
import { editFormElements } from '../templates/edit-task-popup.js';
import { setupPopupDropdowns } from '../templates/dropdown-input-template.js';
import { renderSortingUI } from '../templates/sorting-ui.js';

//Declaration
// filter criteria
const filterFieldDropdown = document.querySelector('.filter-field-dropdown');
const filterOptionsDropdown = document.querySelector('.filter-options-dropdown');

//sort
const sortDropdown = document.querySelector('.sort-dropdown');
const sortOrderToggle = document.querySelector('.sort-order-toggle');
//toggle elements
const boardViewOption = document.querySelector('.board-screen');
const listViewOption = document.querySelector('.list-screen');
const listView = document.querySelector('.list-view');
const boardView = document.querySelector('.board-view');
const editTask = document.getElementById('edit-task-overlay');
const createTask = document.getElementById('create-task-overlay');
//sidebar toggle elements
const toggle = document.querySelector('.menu-bar-toggle');
const sideNavbar = document.querySelector('.side-navbar');
const mainBody = document.querySelector('.main-body');
const appLogo = document.querySelector('.app-logo');

class TaskController {
  constructor() {
    this.model = new TaskModel();
    this.view = new TaskView();
    this.tasks = [];
    this.localStorageUtil = new LocalStorageUtil();
    this.currentSortSetting = {
      field: 'name',
      order: 'asc',
    };
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

  setupDynamicForm() {
    this.createTaskOverlay = document.getElementById('create-task-overlay');
    this.createTaskPopup = this.createTaskOverlay.querySelector('.create-task-popup');

    this.editTaskOverlay = document.getElementById('edit-task-overlay');
    this.editTaskPopup = this.editTaskOverlay.querySelector('.edit-popup');
    createFormElements();
    setupPopupDropdowns();
    editFormElements();
  }

  setupEventListeners() {
    // Add Task Buttons
    const addTaskBtns = document.querySelectorAll('.add-a-task');
    addTaskBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.view.openCreateTaskOverlay();
        mainBody.classList.add('active');
        allTaskPopup.classList.add('hide');
      });
    });

    // Add to List Button
    const addToListButton = document.querySelector('.button-controls .add-to-list');
    if (addToListButton) {
      addToListButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.addTask();
      });
    }

    // Cancel Buttons
    const cancelButtons = document.querySelectorAll('.button-controls .cancel');
    cancelButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.view.closeCreateTaskOverlay());
    });

    const cancelEditButtons = document.querySelectorAll('.edit-controls .cancel');
    cancelEditButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.view.closeEditTaskOverlay());
    });

    //search
    const searchInput = document.querySelector('.input-bar__main-input');

    if (searchInput) {
      searchInput.addEventListener('input', this.searchTasks.bind(this));
    }
    const popupSearchInput = document.querySelector('#all-task-popup .input-bar-mini__main-input');
    if (popupSearchInput) {
      popupSearchInput.addEventListener('input', this.searchTasks.bind(this));
    }
    //open/close all task popup
    const searchBarTop = document.querySelector('.search-bar__input-bar');
    const dashboardBtn = document.querySelector('.dashboard');
    const allTaskPopup = document.getElementById('all-task-popup');
    const allTaskBtn = document.querySelector('.all-tasks');
    allTaskBtn.addEventListener('click', () => {
      allTaskPopup.classList.toggle('hide');
      searchBarTop.classList.add('hide');
      mainBody.classList.add('active');
    });
    dashboardBtn.addEventListener('click', () => {
      allTaskPopup.classList.add('hide');
      searchBarTop.classList.remove('hide');
      mainBody.classList.add('active');
      this.view.closeCreateTaskOverlay();
    });

    // Toggle between views

    boardViewOption.addEventListener('click', (e) => {
      listView.classList.add('hide');
      boardView.classList.remove('hide');
      mainBody.classList.add('active');
      this.view.closeCreateTaskOverlay();
      allTaskPopup.classList.add('hide');
    });

    listViewOption.addEventListener('click', (e) => {
      listView.classList.remove('hide');
      boardView.classList.add('hide');
      mainBody.classList.add('active');
      this.view.closeCreateTaskOverlay();
      allTaskPopup.classList.add('hide');
    });

    // Sidebar toggle
    if (toggle) {
      toggle.addEventListener('click', () => {
        if (sideNavbar) sideNavbar.classList.toggle('active');
        if (mainBody) mainBody.classList.toggle('active');
        if (appLogo) appLogo.classList.toggle('active');
        if (editTask) editTask.classList.toggle('toggle');
        if (createTask) createTask.classList.toggle('toggle');
      });
    }
  }

  // Task Management Methods
  addTask() {
    const title = document.querySelector('#task-name-input').value.trim();
    const startDate = document.querySelector('#task-start-input').value;
    const endDate = document.querySelector('#task-end-input').value;
    const priority = document.querySelector('.priority-select .default-option').textContent.trim();
    const category = document.querySelector('.category-select .default-option').textContent.trim();
    const description = document.querySelector('.textarea-input').value.trim();
    const task = new TaskModel(title, startDate, endDate, description, priority, category);

    // Validate task
    const validationErrors = task.validate();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => showError(error));
      return;
    }

    this.tasks.push(task);
    this.renderTasks();
    this.saveTasksToLocalStorage();
    this.view.resetCreateTaskForm();
    this.view.closeCreateTaskOverlay();
  }

  renderTasks() {
    this.view.renderTasks(this.tasks);
    this.setupTaskActions();
  }

  setupTaskActions() {
    const taskElements = document.querySelectorAll('.task-item');

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
        document.querySelector('.edit-task-button').onclick = () => {
          task.title = document.querySelector('#task-title').value.trim();
          task.startDate = document.querySelector('#start-date').value;
          task.endDate = document.querySelector('#end-date').value;
          task.description = document.querySelector('.textarea-input').value.trim();
          task.priority = document
            .querySelector('#edit-task-overlay .priority-select .default-option')
            .textContent.trim();
          task.category = document
            .querySelector('#edit-task-overlay .category-select .default-option')
            .textContent.trim();
          // Validate task
          const validationErrors = task.validate();

          if (validationErrors.length > 0) {
            validationErrors.forEach((error) => showError(error));
            return;
          }

          this.renderAllTasks();
          this.saveTasksToLocalStorage();
          this.view.closeEditTaskOverlay();
        };
        // Mark as Completed in edit overlay
        const markCompletedButton = document.querySelector('.edit-controls .mark-completed');
        markCompletedButton.onclick = () => {
          task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
          this.renderAllTasks();
          this.saveTasksToLocalStorage();
          this.view.closeEditTaskOverlay();
        };
      });

      // Delete Task
      taskElement.querySelector('.task-delete').addEventListener('click', () => {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.renderAllTasks();
        this.saveTasksToLocalStorage();
        showDeletionNotification();
      });
    });
    const editDeleteButton = document.querySelector('.overlay-delete-button');
    editDeleteButton.addEventListener('click', () => {
      const taskId = parseInt(editDeleteButton.dataset.taskId);
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
      this.renderAllTasks();
      this.saveTasksToLocalStorage();
      showDeletionNotification();
      this.view.closeEditTaskOverlay();
    });
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
    } // Populate filter options
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
      showError(`Invalid sort criteria. Please choose one of: ${validFields.join(', ')}`);
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
  //Apply sorting

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
        ? '<i class="fa-solid fa-sort-up"></i>'
        : '<i class="fa-solid fa-sort-down"></i>';
  }
}
export default TaskController;
