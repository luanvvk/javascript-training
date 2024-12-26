import { createTaskElement } from '../templates/templates.js';
import { showNoTasksMessage } from '../helpers/notifications.js';
import TASK_STATUS from '../constants/task-status.js';
import { createFormElements } from '../templates/templates.js';
class TaskView {
  constructor() {
    this.initializeProperties();
    this.initializeDOMElements();
  }

  initializeProperties() {
    // Define column configurations for all views
    this.columnConfigs = {
      mainList: {
        toDo: document.querySelector('.list-view .task-list--todo'),
        inProgress: document.querySelector('.list-view .task-list--in-progress'),
        completed: document.querySelector('.list-view .task-list--completed'),
      },
      mainBoard: {
        toDo: document.querySelector('.board-view .task-list--todo'),
        inProgress: document.querySelector('.board-view .task-list--in-progress'),
        completed: document.querySelector('.board-view .task-list--completed'),
      },
      popupList: {
        toDo: document.querySelector('#all-task-modal .list-view .task-list--todo'),
        inProgress: document.querySelector('#all-task-modal .list-view .task-list--in-progress'),
        completed: document.querySelector('#all-task-modal .list-view .task-list--completed'),
      },
      popupBoard: {
        toDo: document.querySelector('#all-task-modal .board-view .task-list--todo'),
        inProgress: document.querySelector('#all-task-modal .board-view .task-list--in-progress'),
        completed: document.querySelector('#all-task-modal .board-view .task-list--completed'),
      },
    };
  }

  initializeDOMElements() {
    this.createTaskOverlay = document.getElementById('create-task-modal');
    this.editTaskOverlay = document.getElementById('edit-task-modal');
  }

  renderTasks(tasks) {
    // Render tasks in both main views (list and board)
    this.renderTasksInView(tasks, 'mainList');
    this.renderTasksInView(tasks, 'mainBoard');
  }

  renderAllTasksPopup(tasks) {
    // Render tasks in both popup views (list and board)
    this.renderTasksInView(tasks, 'popupList');
    this.renderTasksInView(tasks, 'popupBoard');
  }

  renderTasksInView(tasks, viewType) {
    const columns = this.columnConfigs[viewType];
    if (!columns) return;

    // Clear all columns
    Object.values(columns).forEach((column) => {
      if (column) column.innerHTML = '';
    });

    // Distribute tasks to appropriate columns
    tasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      const column = this.getColumnForTask(task.status, columns);

      if (column) {
        column.appendChild(taskElement.cloneNode(true));
      }
    });

    // Show "no tasks" message if columns are empty
    this.showNoTasksMessages(columns);
  }

  getColumnForTask(status, columns) {
    const columnMap = {
      'To Do': columns.toDo,
      'In Progress': columns.inProgress,
      Completed: columns.completed,
    };
    return columnMap[status];
  }

  createTaskElement(task) {
    // Import the existing createTaskElement function
    return createTaskElement(task);
  }

  showNoTasksMessages(columns) {
    const messages = {
      toDo: 'No tasks in To Do',
      inProgress: 'No tasks In Progress',
      completed: 'No Completed tasks',
    };

    Object.entries(columns).forEach(([key, column]) => {
      if (column && !column.children.length) {
        column.innerHTML = `<li class="no-tasks-message"><span>${messages[key]}</span></li>`;
      }
    });
  }

  // Open/close overlays
  openCreateTaskOverlay() {
    createFormElements('create');
    this.createTaskOverlay.classList.toggle('hidden');
    document.body.classList.add('overflow-hidden');
  }

  closeCreateTaskOverlay() {
    this.createTaskOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  openEditTaskOverlay() {
    createFormElements('edit');
    this.editTaskOverlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  closeEditTaskOverlay() {
    const allTaskPopup = document.getElementById('all-task-modal');
    if (!allTaskPopup.classList.contains('hidden')) {
      this.editTaskOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    } else {
      this.editTaskOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Populate edit form
  populateEditForm(task) {
    document.querySelector('#task-title').value = task.title;
    document.querySelector('#start-date').value = task.startDate;
    document.querySelector('#end-date').value = task.endDate;
    document.querySelector('#textarea').value = task.description;

    // target priority dropdown value
    const priorityContainer = document.querySelector(
      '#edit-task-modal .form__priority-select .default-option-container .default-option',
    );
    priorityContainer.textContent = task.priority || 'Not Urgent';

    // Target category dropdown value
    const categoryContainer = document.querySelector(
      '#edit-task-modal .form__category-select .default-option-container .default-option',
    );
    categoryContainer.textContent = task.category || 'Daily Task';
  }

  // Reset create task form
  resetCreateTaskForm() {
    document.querySelector('.task-name-input').value = '';
    document.querySelector('.task-start-input').value = '';
    document.querySelector('.task-end-input').value = '';
    document.querySelector('.textarea-input').value = '';
  }
}
export default TaskView;
