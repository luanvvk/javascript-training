import TaskModel from '../models/task-model.js';
import TaskView from '../view/app-view.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';
import { showError } from '../helpers/error-handling.js';
import { showDeletionNotification } from '../helpers/notifications.js';
import { createFormElements } from '../template/create-task-popup.js';
import { editFormElements } from '../template/edit-task-popup.js';

//Declaration
// filter criteria
const filterFieldDropdown = document.getElementById('filter-field-dropdown');
const filterOptionsDropdown = document.getElementById('filter-options-dropdown');
const searchInput = document.querySelector('.input-bar-mini__main-input');
const popupSearchInput = document.querySelector('.input-bar-mini__main-input');
//sort
const sortDropdown = document.getElementById('sort-dropdown');
const sortOrderToggle = document.getElementById('sort-order-toggle');
//toggle elements
const listView = document.getElementById('list-view');
const boardView = document.getElementById('board-view');
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
    this.setupDropdowns();
    editFormElements();
  }

  setupDropdowns() {
    //create task overlay
    // Priority Dropdown
    const createPrioritySelect = this.createTaskOverlay.querySelector('.task-priority');
    const createPriorityContainer = createPrioritySelect.querySelector('.priority-select');
    const createPriorityDropdown = document.createElement('div');
    createPriorityDropdown.classList.add('priority-dropdown');

    const createPriorityOptions = [
      { value: 'Not urgent', default: true },
      { value: 'Urgent task', default: false },
      { value: 'Important', default: false },
    ];

    const createDefaultOption = createPriorityOptions.find((option) => option.default);
    createPriorityContainer.innerHTML = `
     <div class="default-option-container">
     <span class="default-option">${createDefaultOption.value}</span>
     <img src="./assets/images/icons/create-task-modal-icon/priority-icon.svg" class="task-priority-icon" alt="Priority Icon">
    </div>
      `;

    createPriorityOptions.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('priority-options');
      optionElement.textContent = option.value;
      optionElement.addEventListener('click', () => {
        createPriorityContainer.querySelector('.default-option').textContent = option.value;
        createPriorityDropdown.style.display = 'none';
      });
      createPriorityDropdown.appendChild(optionElement);
    });

    createPriorityContainer.appendChild(createPriorityDropdown);
    createPriorityContainer.addEventListener('click', (e) => {
      createPriorityDropdown.style.display =
        createPriorityDropdown.style.display === 'none' ? 'flex' : 'none';
      e.stopPropagation();
    });

    // Category Dropdown
    const createCategorySelect = this.createTaskOverlay.querySelector(
      '#create-task-overlay .task-category-input',
    );
    const createCategoryContainer = createCategorySelect.querySelector(
      '#create-task-overlay .category-select',
    );
    const createCategoryDropdown = document.createElement('div');
    createCategoryDropdown.classList.add('category-dropdown');

    const createCategoryOptions = [
      { value: 'Daily Task', default: true },
      { value: 'Weekly task', default: false },
      { value: 'Monthly task', default: false },
    ];

    const createDefaultCategoryOption = createCategoryOptions.find((option) => option.default);
    createCategoryContainer.innerHTML = `
    <div class="default-option-container">
    <span class="default-option">${createDefaultCategoryOption.value}</span>
      <img src="./assets/images/icons/create-task-modal-icon/priority-icon.svg" class="task-category-icon" alt="Category Icon">
    </div>
      `;

    createCategoryOptions.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('category-options');
      optionElement.textContent = option.value;
      optionElement.addEventListener('click', () => {
        createCategoryContainer.querySelector('.default-option').textContent = option.value;
        createCategoryDropdown.style.display = 'none';
      });
      createCategoryDropdown.appendChild(optionElement);
    });

    createCategoryContainer.appendChild(createCategoryDropdown);
    createCategoryContainer.addEventListener('click', (e) => {
      createCategoryDropdown.style.display =
        createCategoryDropdown.style.display === 'none' ? 'flex' : 'none';
      e.stopPropagation();
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      createPriorityDropdown.style.display = 'none';
      createCategoryDropdown.style.display = 'none';
    });
    //edit task overlay
    // Priority Dropdown
    const editPrioritySelect = this.editTaskOverlay.querySelector('.task-priority');
    const editPriorityContainer = editPrioritySelect.querySelector('.priority-select');
    const editPriorityDropdown = document.createElement('div');
    editPriorityDropdown.classList.add('priority-dropdown');

    const editPriorityOptions = [
      { value: 'Not urgent', default: true },
      { value: 'Urgent task', default: false },
      { value: 'Important', default: false },
    ];

    const editDefaultOption =
      editPriorityOptions.find((option) => option.default) || editPriorityOptions[0];
    editPriorityContainer.innerHTML = `
     <div class="default-option-container">
     <span class="default-option">${editDefaultOption.value}</span>
     <img src="./assets/images/icons/create-task-modal-icon/priority-icon.svg" class="task-priority-icon" alt="Priority Icon">
    </div>
      `;

    editPriorityOptions.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('priority-options');
      optionElement.textContent = option.value;
      optionElement.addEventListener('click', () => {
        editPriorityContainer.querySelector('.default-option').textContent = option.value;
        editPriorityDropdown.style.display = 'none';
      });
      editPriorityDropdown.appendChild(optionElement);
    });

    editPriorityContainer.appendChild(editPriorityDropdown);
    editPriorityContainer.addEventListener('click', (e) => {
      editPriorityDropdown.style.display =
        editPriorityDropdown.style.display === 'none' ? 'flex' : 'none';
      e.stopPropagation();
    });

    // Category Dropdown
    const editCategorySelect = this.editTaskOverlay.querySelector(
      '#edit-task-overlay .task-category-input',
    );
    const editCategoryContainer = editCategorySelect.querySelector(
      '#edit-task-overlay .category-select',
    );
    const editCategoryDropdown = document.createElement('div');
    editCategoryDropdown.classList.add('category-dropdown');

    const editCategoryOptions = [
      { value: 'Daily Task', default: true },
      { value: 'Weekly task', default: false },
      { value: 'Monthly task', default: false },
    ];

    const editDefaultCategoryOption =
      editCategoryOptions.find((option) => option.default) || editCategoryOptions[0];
    editCategoryContainer.innerHTML = `
    <div class="default-option-container">
    <span class="default-option">${editDefaultCategoryOption.value}</span>
      <img src="./assets/images/icons/create-task-modal-icon/priority-icon.svg" class="task-category-icon" alt="Category Icon">
    </div>
      `;

    editCategoryOptions.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('category-options');
      optionElement.textContent = option.value;
      optionElement.addEventListener('click', () => {
        editCategoryContainer.querySelector('.default-option').textContent = option.value;
        editCategoryDropdown.style.display = 'none';
      });
      editCategoryDropdown.appendChild(optionElement);
    });

    editCategoryContainer.appendChild(editCategoryDropdown);
    editCategoryContainer.addEventListener('click', (e) => {
      editCategoryDropdown.style.display =
        editCategoryDropdown.style.display === 'none' ? 'flex' : 'none';
      e.stopPropagation();
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      editPriorityDropdown.style.display = 'none';
      editCategoryDropdown.style.display = 'none';
    });
  }

  setupEventListeners() {
    // Add Task Buttons
    const addTaskBtns = document.querySelectorAll('.add-a-task');
    addTaskBtns.forEach((btn) => {
      btn.addEventListener('click', () => this.view.openCreateTaskOverlay());
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
    const allTaskBtn = document.querySelector('.completed-tasks');
    allTaskBtn.addEventListener('click', () => {
      allTaskPopup.classList.toggle('hide');
      searchBarTop.classList.add('hide');
    });
    dashboardBtn.addEventListener('click', () => {
      allTaskPopup.classList.add('hide');
      searchBarTop.classList.remove('hide');
    });

    // Toggle between views
    const viewOptions = document.querySelectorAll("input[name='view-option']");

    viewOptions.forEach((option) => {
      option.addEventListener('change', (e) => {
        if (e.target.value === 'board') {
          if (listView) listView.classList.add('hide');
          if (boardView) boardView.classList.remove('hide');
        } else {
          if (boardView) boardView.classList.add('hide');
          if (listView) listView.classList.remove('hide');
        }
      });
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
    const priority = document.querySelector('#priority-select .default-option').textContent.trim();
    const category = document.querySelector('#category-select .default-option').textContent.trim();
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
        this.setupDropdowns(task);
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
  formatSearchDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .toLowerCase();
  }
  //filter task methood
  filterTask(options = {}) {
    const { category = 'All', priority = 'All', status = 'All', searchText = '' } = options;
    console.log('filter options:', options);

    console.log('Filter Task Debug:');
    console.log('Options:', options);
    console.log('Category:', category);
    console.log('Priority:', priority);
    console.log('Status:', status);
    console.log('Search Text:', searchText);

    let filteredTasks = this.tasks;

    console.log('Performing search filter');

    if (searchText) {
      filteredTasks = filteredTasks.filter((task) => {
        const matches =
          task.title.toLowerCase().includes(searchText) ||
          task.description.toLowerCase().includes(searchText) ||
          task.category.toLowerCase().includes(searchText) ||
          task.priority.toLowerCase().includes(searchText);
        console.log(`Task: ${task.title}, Matches: ${matches}`);
        return matches;
      });
    }
    // Filter by category
    if (category !== 'All') {
      console.log('Performing category filter');

      filteredTasks = filteredTasks.filter(
        (task) => task.category.toLowerCase() === category.toLowerCase(),
      );
    }
    //Filer by priority
    if (priority !== 'All') {
      console.log('Performing priority filter');
      filteredTasks = filteredTasks.filter(
        (task) => task.priority.toLowerCase() === priority.toLowerCase(),
      );
    }
    //Filter by status
    if (status !== 'All') {
      console.log('Performing status filter');
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }
    console.log('Final Filtered Tasks:', filteredTasks);
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
    const filterOptionsDropdown = document.getElementById('filter-options-dropdown');
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

    this.applyFilters(); // Re-apply filters with default "All"
  }
  //Apply filters
  applyFilters() {
    const filterField = filterFieldDropdown ? filterFieldDropdown.value : 'category';
    const filterValue = filterOptionsDropdown ? filterOptionsDropdown.value : 'All';
    const searchInput = document.querySelector('.input-bar-mini__main-input');
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    console.log('Apply Filters Debug:');
    console.log('Filter Field:', filterField);
    console.log('Filter Value:', filterValue);
    console.log('Search Text:', searchText);

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
    console.log('Filtered Tasks:', filteredTasks);
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
