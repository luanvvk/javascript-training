class EventDelegate {
  constructor() {
    this.handlers = new Map();
  }

  // Add delegated event listener
  on(parentSelector, eventType, childSelector, handler) {
    const parents = document.querySelectorAll(parentSelector);
    if (!parents.length) {
      console.warn(`Parent element not found: ${parentSelector}`);
      return;
    }

    const eventHandler = (event) => {
      const matchingChild = event.target.closest(childSelector);
      if (matchingChild) {
        handler(event, matchingChild);
      }
    };

    // Store handler reference for potential removal
    this.handlers.set(handler, eventHandler);
    parentSelector.forEach;
  }

  // Remove delegated event listener
  off(parentSelector, eventType, handler) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    const eventHandler = this.handlers.get(handler);
    if (eventHandler) {
      parent.removeEventListener(eventType, eventHandler);
      this.handlers.delete(handler);
    }
  }
}

// Optimized TaskController with event delegation
class TaskController {
  constructor() {
    this.model = new TaskModel();
    this.view = new TaskView();
    this.tasks = [];
    this.delegate = new EventDelegate();
    this.initialize();
  }

  initialize() {
    this.loadTasksFromLocalStorage();
    this.setupEventDelegation();
    this.renderAllTasks();
  }

  setupEventDelegation() {
    // Task actions delegation
    this.delegate.on('.task-columns', 'click', '.status-button', (event, button) => {
      const taskId = parseInt(button.closest('.task-item').dataset.taskId);
      this.handleStatusChange(taskId);
    });

    this.delegate.on('.task-columns', 'click', '.task-edit', (event, button) => {
      const taskId = parseInt(button.closest('.task-item').dataset.taskId);
      this.handleTaskEdit(taskId);
    });

    this.delegate.on('.task-columns', 'click', '.task-delete', (event, button) => {
      const taskId = parseInt(button.closest('.task-item').dataset.taskId);
      this.openDeleteConfirmationPopup(taskId, 'main-view');
    });

    // Form submissions
    this.delegate.on('#create-task-overlay', 'submit', 'form', (event) => {
      event.preventDefault();
      this.addTask();
    });

    this.delegate.on('#edit-task-overlay', 'submit', 'form', (event) => {
      event.preventDefault();
      this.saveEditedTask();
    });

    // Navigation delegation
    this.delegate.on('.app__sidebar', 'click', '.app__nav-link', (event, link) => {
      this.handleNavigation(link);
    });

    // Search delegation
    this.delegate.on('.search-bar__input-bar', 'input', 'input', (event) => {
      this.searchTasks(event);
    });

    // Filter and sort delegation
    this.delegate.on('.filter-wrapper', 'change', 'select', (event) => {
      this.handleFilterSort(event);
    });
  }

  handleStatusChange(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

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

  handleTaskEdit(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    this.view.populateEditForm(task);
    this.view.openEditTaskOverlay();
    document.querySelector('.overlay-delete-button').dataset.taskId = taskId;
  }

  saveEditedTask() {
    const taskId = parseInt(document.querySelector('.overlay-delete-button').dataset.taskId);
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const formData = {
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

    Object.assign(task, formData);

    if (this.validate(task)) {
      this.saveTasksToLocalStorage();
      this.renderAllTasks();
      this.view.closeEditTaskOverlay();
    }
  }

  handleNavigation(link) {
    if (link.classList.contains('app__nav-link--dashboard')) {
      this.showDashboard();
    } else if (link.classList.contains('app__nav-link--board-screen')) {
      this.switchToView('board');
    } else if (link.classList.contains('app__nav-link--list-screen')) {
      this.switchToView('list');
    } else if (link.classList.contains('app__nav-link--all-tasks')) {
      this.showAllTasks();
    }
  }

  handleFilterSort(event) {
    const { target } = event;
    if (target.classList.contains('filter-field-dropdown')) {
      this.populateFilterOptions(target.value);
    } else if (
      target.classList.contains('filter-options-dropdown') ||
      target.classList.contains('sort-dropdown')
    ) {
      this.applyFilters();
    }
  }

  // Rest of the TaskController methods remain the same...
}

// Optimized TaskView with event delegation
class TaskView {
  constructor() {
    this.delegate = new EventDelegate();
    this.setupViewDelegation();
  }

  setupViewDelegation() {
    // Close buttons delegation
    this.delegate.on('body', 'click', '.close-popup', (event, button) => {
      const overlay = button.closest('.overlay');
      if (overlay) {
        this.closeOverlay(overlay.id);
      }
    });

    // Cancel buttons delegation
    this.delegate.on('body', 'click', '.cancel', (event, button) => {
      const overlay = button.closest('.overlay');
      if (overlay) {
        this.closeOverlay(overlay.id);
      }
    });
  }

  closeOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Rest of the TaskView methods remain the same...
}
