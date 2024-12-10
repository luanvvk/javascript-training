class TaskModel {
  constructor() {
    this.tasks = [];
  }

  // Add a new task
  addTask(title, startDate, endDate, description, priority, category) {
    const task = new Task(title, startDate, endDate, description, priority, category);
    this.tasks.push(task);
    this.notifyObservers();
    return task;
  }

  // Remove a task by ID
  removeTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.notifyObservers();
  }

  // Update an existing task
  updateTask(taskId, updatedTaskData) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTaskData };
      this.notifyObservers();
    }
  }

  // Toggle task status
  toggleTaskStatus(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
      this.notifyObservers();
    }
  }

  // Get all tasks
  getTasks() {
    return [...this.tasks];
  }

  // Observer pattern for view updates
  constructor() {
    this.tasks = [];
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.tasks));
  }
}

// View: Handles rendering and user interface
class TaskView {
  constructor(model) {
    this.model = model;
    this.listViewColumns = {
      toDo: document.querySelector('#list-view .task-column.pink .task-list'),
      running: document.querySelector('#list-view .task-column.blue .task-list'),
      completed: document.querySelector('#list-view .task-column.green .task-list'),
    };

    this.boardViewColumns = {
      toDo: document.querySelector('#board-view #todo .task-list'),
      running: document.querySelector('#board-view #doing .task-list'),
      completed: document.querySelector('#board-view #done .task-list'),
    };

    this.createTaskOverlay = document.getElementById('create-task-overlay');
    this.editTaskOverlay = document.getElementById('edit-task-overlay');
    this.notification = document.getElementById('notification');

    // Bind methods
    this.renderTasks = this.renderTasks.bind(this);
  }

  // Update method for observer pattern
  update(tasks) {
    this.renderTasks(tasks);
  }

  // Render tasks in both views
  renderTasks(tasks) {
    // Clear previous tasks
    Object.values(this.listViewColumns).forEach(column => column.innerHTML = '');
    Object.values(this.boardViewColumns).forEach(column => column.innerHTML = '');

    // Render tasks in appropriate columns
    tasks.forEach(task => {
      const taskHTML = this.createTaskElement(task);

      switch (task.status) {
        case 'To Do':
          this.listViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          this.boardViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          break;
        case 'In Progress':
          this.listViewColumns.running.appendChild(taskHTML.cloneNode(true));
          this.boardViewColumns.running.appendChild(taskHTML.cloneNode(true));
          break;
        case 'Completed':
          this.listViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          this.boardViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          break;
      }
    });

    this.bindTaskActions(tasks);
  }

  // Create task HTML element
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

  // Bind task action event listeners
  bindTaskActions(tasks) {
    const taskElements = document.querySelectorAll('.task-item');

    taskElements.forEach(taskElement => {
      const taskId = parseInt(taskElement.dataset.taskId);
      const task = tasks.find(t => t.id === taskId);

      // Mark completed button
      taskElement.querySelector('.mark-completed').addEventListener('click', () => {
        this.controller.toggleTaskStatus(taskId);
      });

      // Edit task button
      taskElement.querySelector('.task-edit').addEventListener('click', () => {
        this.showEditOverlay(task);
      });

      // Delete task button
      taskElement.querySelector('.task-delete').addEventListener('click', () => {
        this.controller.deleteTask(taskId);
        this.showNotification();
      });
    });
  }

  // Show edit overlay
  showEditOverlay(task) {
    document.querySelector('#task-title').value = task.title;
    document.querySelector('#start-date').value = task.startDate;
    document.querySelector('#end-date').value = task.endDate;
    document.querySelector('.textarea-input').value = task.description;

    this.editTaskOverlay.classList.remove('hide');
    document.body.classList.add('overflow-hidden');

    // Update task handler
    document.querySelector('.edit-task-button').onclick = () => {
      const updatedTask = {
        title: document.querySelector('#task-title').value.trim(),
        startDate: document.querySelector('#start-date').value,
        endDate: document.querySelector('#end-date').value,
        description: document.querySelector('.textarea-input').value.trim()
      };
      this.controller.updateTask(task.id, updatedTask);
      this.closeOverlay(this.editTaskOverlay);
    };
  }

  // Utility methods
  formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  calculateTaskDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 0 ? 'Same day' : `${diffDays} day${diffDays !== 1 ? 's' : ''} long`;
  }

  // Show notification
  showNotification() {
    this.notification.classList.add('show');
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }

  // Close overlay
  closeOverlay(overlay) {
    overlay.classList.add('hide');
    document.body.classList.remove('overflow-hidden');
  }

  // Show error notification
  showError(message) {
    const errorNotification = document.createElement('div');
    errorNotification.classList.add('error-notification');
    errorNotification.textContent = message;
    document.querySelector('.main-body').prepend(errorNotification);
    
    setTimeout(() => {
      errorNotification.remove();
    }, 3000);
  }

  // Bind form submission events
  bindFormEvents(controller) {
    const addToListButton = document.querySelector('.button-controls .add-to-list');
    const cancelButtons = document.querySelectorAll('.button-controls .cancel');
    const addTaskBtns = document.querySelectorAll('.add-a-task');

    // Add task button
    addTaskBtns.forEach(btn => 
      btn.addEventListener('click', () => {
        this.createTaskOverlay.classList.remove('hide');
        document.body.classList.add('overflow-hidden');
      })
    );

    // Submit task button
    addToListButton.addEventListener('click', (e) => {
      e.preventDefault();
      
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

      controller.addTask(title, startDate, endDate, description, priority, category);
      this.resetForm();
      this.closeOverlay(this.createTaskOverlay);
    });

    // Cancel buttons
    cancelButtons.forEach(btn => 
      btn.addEventListener('click', () => {
        this.closeOverlay(this.createTaskOverlay);
      })
    );
  }

  // Reset form
  resetForm() {
    document.querySelector('#task-name-input').value = '';
    document.querySelector('#task-start-input').value = '';
    document.querySelector('#task-end-input').value = '';
    document.querySelector('.textarea-input').value = '';
  }

  // Set controller reference
  setController(controller) {
    this.controller = controller;
  }
}

// Controller: Handles interactions between Model and View
class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Add model observer
    this.model.addObserver(this.view);

    // Bind form events
    this.view.bindFormEvents(this);
    
    // Set view controller reference
    this.view.setController(this);
  }

  // Add task
  addTask(title, startDate, endDate, description, priority, category) {
    this.model.addTask(title, startDate, endDate, description, priority, category);
  }

  // Delete task
  deleteTask(taskId) {
    this.model.removeTask(taskId);
  }

  // Update task
  updateTask(taskId, updatedTaskData) {
    this.model.updateTask(taskId, updatedTaskData);
  }

  // Toggle task status
  toggleTaskStatus(taskId) {
    this.model.toggleTaskStatus(taskId);
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const model = new TaskModel();
  const view = new TaskView(model);
  const controller = new TaskController(model, view);
});