class TaskController {
  constructor() {
    this.model = new TaskModel();
    this.view = new TaskView();
    this.tasks = [];

    this.initialize();
  }

  initialize() {
    this.loadTasksFromLocalStorage();
    this.setupDynamicForm();
    this.setupEventListeners();
    this.renderTasks();
  }

  setupDynamicForm() {
    this.createTaskOverlay = document.getElementById('create-task-overlay');
    this.createTaskPopup = this.createTaskOverlay.querySelector('.create-task-popup');
    this.createFormElements();
    this.setupDropdowns();
  }

  createFormElements() {
    // Task Name Input
    const taskNameContainer = this.createTaskOverlay.querySelector('.task-name');
    taskNameContainer.innerHTML = `
      <h2 class="label" id="task-title">Task title</h2>
      <div class="task-name-container">
        <input type="text" id="task-name-input" class="task-name-input" placeholder="Enter task title" required>
        <img src="./assests/images/icons/create-task-modal-icon/task-title-icon.svg" class="task-name-icon" alt="Task Title Icon">
      </div>
    `;

    // Start Date Input
    const taskStartContainer = this.createTaskOverlay.querySelector('.task-start');
    taskStartContainer.innerHTML = `
      <h2 class="label" id="start-date">Start date</h2>
      <div class="task-start-container">
        <input type="date" id="task-start-input" class="task-start-input" required>
        <img src="./assests/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-start-icon" alt="Start Date Icon">
      </div>
    `;

    // End Date Input
    const taskEndContainer = this.createTaskOverlay.querySelector('.task-end');
    taskEndContainer.innerHTML = `
      <h2 class="label" id="end-date">End date</h2>
      <div class="task-end-container">
        <input type="date" id="task-end-input" class="task-end-input" required>
        <img src="./assests/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-end-icon" alt="End Date Icon">
      </div>
    `;

    // Task Description
    const taskDescContainer = this.createTaskOverlay.querySelector('.task-desc');
    taskDescContainer.innerHTML = `
      <h2 class="label">Task description</h2>
      <textarea id="task-description-input" class="textarea-input" rows="8" placeholder="Enter task description"></textarea>
    `;

    // Button Controls
    const buttonControls = this.createTaskOverlay.querySelector('.button-controls');
    buttonControls.innerHTML = `
      <button class="add-to-list">Add to list</button>
      <button class="cancel">Cancel</button>
    `;
  }

  setupDropdowns() {
    // Priority Dropdown
    const prioritySelect = this.createTaskOverlay.querySelector('.task-priority');
    const priorityContainer = prioritySelect.querySelector('.priority-select');
    const priorityDropdown = document.createElement('div');
    priorityDropdown.classList.add('priority-dropdown');

    const priorityOptions = [
      { value: 'Not urgent', default: true },
      { value: 'Urgent task', default: false },
      { value: 'Important', default: false },
    ];

    const defaultOption = priorityOptions.find((option) => option.default);
    priorityContainer.innerHTML = `
     <div class="default-option-container">
     <span class="default-option">${defaultOption.value}</span>
     <img src="./assests/images/icons/create-task-modal-icon/priority-icon.svg" class="task-priority-icon" alt="Priority Icon">
    </div>
      `;

    priorityOptions.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('priority-options');
      optionElement.textContent = option.value;
      optionElement.addEventListener('click', () => {
        priorityContainer.querySelector('.default-option').textContent = option.value;
        priorityDropdown.style.display = 'none';
      });
      priorityDropdown.appendChild(optionElement);
    });

    priorityContainer.appendChild(priorityDropdown);
    priorityContainer.addEventListener('click', (e) => {
      priorityDropdown.style.display = priorityDropdown.style.display === 'none' ? 'flex' : 'none';
      e.stopPropagation();
    });

    // Category Dropdown
    const categorySelect = this.createTaskOverlay.querySelector('.task-category-input');
    const categoryContainer = categorySelect.querySelector('.category-select');
    const categoryDropdown = document.createElement('div');
    categoryDropdown.classList.add('category-dropdown');

    const categoryOptions = [
      { value: 'Daily Task', default: true },
      { value: 'Weekly task', default: false },
      { value: 'Monthly task', default: false },
    ];

    const defaultCategoryOption = categoryOptions.find((option) => option.default);
    categoryContainer.innerHTML = `
    <div class="default-option-container">
    <span class="default-option">${defaultCategoryOption.value}</span>
      <img src="./assests/images/icons/create-task-modal-icon/priority-icon.svg" class="task-category-icon" alt="Category Icon">
    </div>
      `;

    categoryOptions.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('category-options');
      optionElement.textContent = option.value;
      optionElement.addEventListener('click', () => {
        categoryContainer.querySelector('.default-option').textContent = option.value;
        categoryDropdown.style.display = 'none';
      });
      categoryDropdown.appendChild(optionElement);
    });

    categoryContainer.appendChild(categoryDropdown);
    categoryContainer.addEventListener('click', (e) => {
      categoryDropdown.style.display = categoryDropdown.style.display === 'none' ? 'flex' : 'none';
      e.stopPropagation();
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      priorityDropdown.style.display = 'none';
      categoryDropdown.style.display = 'none';
    });
  }

  // Local Storage Methods
  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks.map((task) => task.toJSON())));
  }

  loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        this.tasks = parsedTasks.map((taskJson) => TaskModel.fromJSON(taskJson));
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        this.tasks = [];
      }
    }
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

    // Toggle between views
    const viewOptions = document.querySelectorAll("input[name='view-option']");
    const listView = document.getElementById('list-view');
    const boardView = document.getElementById('board-view');

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
    const toggle = document.querySelector('.menu-bar-toggle');
    const sideNavbar = document.querySelector('.side-navbar');
    const mainBody = document.querySelector('.main-body');
    const appLogo = document.querySelector('.app-logo');

    if (toggle) {
      toggle.addEventListener('click', () => {
        if (sideNavbar) sideNavbar.classList.toggle('active');
        if (mainBody) mainBody.classList.toggle('active');
        if (appLogo) appLogo.classList.toggle('active');

        const editTask = document.getElementById('edit-task-overlay');
        if (editTask) editTask.classList.toggle('toggle');
        const createTask = document.getElementById('create-task-overlay');
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
      validationErrors.forEach((error) => this.view.showError(error));
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

      // Mark as Completed/In Progress
      taskElement.querySelector('.mark-completed').addEventListener('click', () => {
        task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
        this.renderTasks();
        this.saveTasksToLocalStorage();
      });

      // Edit Task
      taskElement.querySelector('.task-edit').addEventListener('click', () => {
        this.view.populateEditForm(task);
        this.view.openEditTaskOverlay();

        // Save edit
        document.querySelector('.edit-task-button').onclick = () => {
          task.title = document.querySelector('#task-title').value.trim();
          task.startDate = document.querySelector('#start-date').value;
          task.endDate = document.querySelector('#end-date').value;
          task.description = document.querySelector('.textarea-input').value.trim();

          // Validate task
          const validationErrors = task.validate();
          if (validationErrors.length > 0) {
            validationErrors.forEach((error) => this.view.showError(error));
            return;
          }

          this.renderTasks();
          this.saveTasksToLocalStorage();
          this.view.closeEditTaskOverlay();
        };
      });

      // Delete Task
      taskElement.querySelector('.task-delete').addEventListener('click', () => {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.renderTasks();
        this.saveTasksToLocalStorage();
        this.view.showDeletionNotification();
      });
    });
    const editDeleteButton = document.querySelector('.overlay-delete-button');
    editDeleteButton.addEventListener('click', () => {
      const taskId = parseInt(editDeleteButton.dataset.taskId);
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
      this.renderTasks();
      this.saveTasksToLocalStorage();
      this.view.showDeletionNotification();
    });
  }
}
