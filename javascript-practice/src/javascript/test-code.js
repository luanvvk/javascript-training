class Task {
  constructor(
    title,
    startDate,
    endDate,
    description,
    priority = 'Not urgent',
    category = 'Daily Task',
  ) {
    this.id = Date.now();
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.priority = priority;
    this.description = description;
    this.category = category;
    this.status = 'To Do'; // Default status
  }
  //Convert task to a plain object for storage
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      priority: this.priority,
      description: this.description,
      category: this.category,
      status: this.status,
    };
  }
  //Create a Task instance from a stored object
  static fromJSON(json) {
    const task = new Task(
      json.title,
      json.startDate,
      json.endDate,
      json.description,
      json.priority,
      json.category,
    );
    task.id = json.id;
    task.status = json.status;
    return task;
  }
}

class TaskManager {
  constructor() {
    this.tasks = [];
    this.initialize();
  }

  // Initialize event listeners
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

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        this.tasks = parsedTasks.map((taskJson) => Task.fromJSON(taskJson));
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        this.tasks = [];
      }
    }
  }

  // Add event listeners
  setupEventListeners() {
    const addTaskBtns = document.querySelectorAll('.add-a-task');
    const createTaskOverlay = document.getElementById('create-task-overlay');
    const addToListButton = document.querySelector('.button-controls .add-to-list');
    const cancelButtons = document.querySelectorAll('.button-controls .cancel');
    const editOverlay = document.getElementById('edit-task-overlay');
    const cancelEditBtn = document.querySelector('.edit-controls .cancel');
    const overlayDeleteBtn = document.querySelectorAll('.overlay-delete-button');

    addTaskBtns.forEach((btn) =>
      btn.addEventListener('click', () => {
        createTaskOverlay.classList.remove('hide');
        document.body.classList.add('overflow-hidden');
      }),
    );

    addToListButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.addTask();
    });

    cancelButtons.forEach((btn) =>
      btn.addEventListener('click', () => {
        this.closeOverlay(createTaskOverlay);
      }),
    );

    cancelEditBtn.addEventListener('click', () => {
      editOverlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    });

    overlayDeleteBtn.forEach((button) => {
      button.addEventListener('click', () => {
        const taskElement = button.closest('.edit-controls');
        const taskId = parseInt(taskElement.dataset.taskId);

        // Remove task from tasks array
        this.tasks = this.tasks.filter((t) => t.id !== taskId);

        this.closeOverlay(document.getElementById('edit-task-overlay'));
        // Show notification
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3000);
      });
    });

    // Toggle between views
    const viewOptions = document.querySelectorAll("input[name='view-option']");
    const listView = document.getElementById('list-view');
    const boardView = document.getElementById('board-view');
    viewOptions.forEach((option) =>
      option.addEventListener('change', (e) => {
        if (e.target.value === 'board') {
          listView.classList.add('hide');
          boardView.classList.remove('hide');
        } else {
          boardView.classList.add('hide');
          listView.classList.remove('hide');
        }
      }),
    );
    //handle side bar hover effect
    let list = document.querySelectorAll('.navbar--list__item');
    function activeLink() {
      list.forEach((item) => {
        item.classList.remove('hovered');
      });
      this.classList.add('hovered');
    }

    list.forEach((item) => item.addEventListener('onmouseenter', activeLink));
    // handle menu Toggle
    let toggle = document.querySelector('.menu-bar-toggle');
    let sideNavbar = document.querySelector('.side-navbar');
    let mainBody = document.querySelector('.main-body');
    let appLogo = document.querySelector('.app-logo');

    toggle.onclick = function () {
      sideNavbar.classList.toggle('active');
      mainBody.classList.toggle('active');
      appLogo.classList.toggle('active');
      const editTask = document.getElementById('edit-task-overlay');
      editTask.classList.toggle('toggle');
      const createTask = document.getElementById('create-task-overlay');
      createTask.classList.toggle('toggle');
    };
  }

  // Add a new task
  addTask() {
    const title = document.querySelector('#task-name-input').value.trim();
    const startDate = document.querySelector('#task-start-input').value;
    const endDate = document.querySelector('#task-end-input').value;
    const priority = document.querySelector('#priority-select .default-option').textContent.trim();
    const category = document.querySelector('#category-select .default-option').textContent.trim();
    const description = document.querySelector('.textarea-input').value.trim();

    if (!title || !startDate || !endDate) {
      this.showError('Please fill in all required fields.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      this.showError('Start date must be earlier than or equal to end date.');
      return;
    }

    const task = new Task(title, startDate, endDate, description, priority, category);
    this.tasks.push(task);
    this.renderTasks();
    this.saveTasksToLocalStorage();
    this.resetForm();
    this.closeOverlay(document.getElementById('create-task-overlay'));
  }

  // Render tasks in both views
  renderTasks() {
    const listViewColumns = {
      toDo: document.querySelector('#list-view .task-column.pink .task-list'),
      running: document.querySelector('#list-view .task-column.blue .task-list'),
      completed: document.querySelector('#list-view .task-column.green .task-list'),
    };

    const boardViewColumns = {
      toDo: document.querySelector('#board-view #todo .task-list'),
      running: document.querySelector('#board-view #doing .task-list'),
      completed: document.querySelector('#board-view #done .task-list'),
    };

    // Clear previous tasks
    Object.values(listViewColumns).forEach((column) => (column.innerHTML = ''));
    Object.values(boardViewColumns).forEach((column) => (column.innerHTML = ''));

    // Render tasks in appropriate columns
    this.tasks.forEach((task) => {
      const taskHTML = this.createTaskElement(task);

      switch (task.status) {
        case 'To Do':
          listViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          boardViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          break;
        case 'In Progress':
          listViewColumns.running.appendChild(taskHTML.cloneNode(true));
          boardViewColumns.running.appendChild(taskHTML.cloneNode(true));
          break;
        case 'Completed':
          listViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          boardViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          break;
      }
    });

    this.setupTaskActions();
  }

  // Create task HTML
  createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
       <div class="task-item__details">
        <h3 class="task-item__heading">${task.title}</h3>
        <h4 class="start-date">Start date: ${this.formatDate(task.startDate)}</h4>
        <h4 class="end-date">End date: ${this.formatDate(task.endDate)}</h4>
        <div class="task-duration">
          <span class="duration-badge">Duration: ${this.calculateTaskDuration(task.startDate, task.endDate)}</span>
        </div>
        <button class="mark-completed">
          <img class="button-icon" src="./assests/images/icons/task-icons/mark-as-completed-icon.svg" alt="button-icon" loading="lazy" />
          <span class="confirm-button-desc">${task.status === 'Completed' ? 'Mark as In Progress' : 'Mark as Completed'}</span>
        </button>
      </div>
        <div class="task-item-actions">
          <a class="task-edit" href="javascript:void(0)">
            <img class="task-edit-icon" src="./assests/images/icons/task-icons/task-edit-icon.svg" alt="task-edit-icon" />
          </a>
          <a class="task-delete" href="javascript:void(0)">
            <img class="task-delete-icon" src="./assests/images/icons/task-icons/task-delete-icon.svg" alt="task-delete-icon" />
          </a>
      </div>`;
    return taskElement;
  }

  formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  calculateTaskDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Same day';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} long`;
  }

  // Setup task action buttons
  setupTaskActions() {
    const taskElements = document.querySelectorAll('.task-item');
    const notification = document.getElementById('notification');

    taskElements.forEach((taskElement) => {
      const taskId = parseInt(taskElement.dataset.taskId);
      const task = this.tasks.find((t) => t.id === taskId);

      taskElement.querySelector('.mark-completed').addEventListener('click', () => {
        task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
        this.renderTasks();
        this.saveTasksToLocalStorage();
      });

      taskElement.querySelector('.task-edit').addEventListener('click', () => {
        this.populateEditForm(task);
      });

      taskElement.querySelector('.task-delete').addEventListener('click', () => {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.renderTasks();
        this.saveTasksToLocalStorage();
        // Show notification
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3000);
      });
    });
  }

  // Populate edit form
  populateEditForm(task) {
    const editOverlay = document.getElementById('edit-task-overlay');
    document.querySelector('#task-title').value = task.title;
    document.querySelector('#start-date').value = task.startDate;
    document.querySelector('#end-date').value = task.endDate;
    document.querySelector('.textarea-input').value = task.description;

    editOverlay.classList.remove('hide');
    document.body.classList.add('overflow-hidden');

    document.querySelector('.edit-task-button').onclick = () => {
      task.title = document.querySelector('#task-title').value.trim();
      task.startDate = document.querySelector('#start-date').value;
      task.endDate = document.querySelector('#end-date').value;
      task.description = document.querySelector('.textarea-input').value.trim();
      this.renderTasks();
      this.saveTasksToLocalStorage();
      this.closeOverlay(editOverlay);
    };
  }

  // Close overlay
  closeOverlay(overlay) {
    overlay.classList.add('hide');
    document.body.classList.remove('overflow-hidden');
  }

  // Reset form
  resetForm() {
    document.querySelector('#task-name-input').value = '';
    document.querySelector('#task-start-input').value = '';
    document.querySelector('#task-end-input').value = '';
    document.querySelector('.textarea-input').value = '';
  }

  // Show error notification
  showError(message) {
    const errorNotification = document.createElement('div');
    errorNotification.classList.add('error-notification');
    errorNotification.textContent = message;
    document.querySelector('.main-body').prepend(errorNotification);
    // Remove after 3 seconds
    setTimeout(() => {
      errorNotification.remove();
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new TaskManager());
