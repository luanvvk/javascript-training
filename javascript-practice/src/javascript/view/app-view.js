import { createTaskElement } from '../template/task-template.js';
import { showNoTasksMessage } from '../helpers/notifications.js';
class TaskView {
  constructor() {
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
  }

  // Render tasks in both views
  renderTasks(tasks) {
    // Clear previous tasks
    Object.values(this.listViewColumns).forEach((column) => (column.innerHTML = ''));
    Object.values(this.boardViewColumns).forEach((column) => (column.innerHTML = ''));

    // Render tasks in appropriate columns
    tasks.forEach((task) => {
      const taskHTML = createTaskElement(task);

      taskHTML.style.boxShadow = this.getTaskShadowColor(task.status);

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
    // Show a "no tasks" message if columns are empty
    showNoTasksMessage(this.listViewColumns, 'list-view');
    showNoTasksMessage(this.boardViewColumns, 'board-view');
  }

  //render shadow for all task
  getTaskShadowColor(status) {
    switch (status) {
      case 'To Do':
        return 'var(--pink-shadow)';
      case 'In Progress':
        return 'var(--blue-shadow)';
      case 'Completed':
        return 'var(--green-shadow)';
      default:
        return 'none';
    }
  }
  //render all task popup
  renderAllTasksPopup(tasks) {
    const popupToDoColumn = document.querySelector('#all-task-popup .task-column.todo .task-list');
    const popupInProgressColumn = document.querySelector(
      '#all-task-popup .task-column.in-progress .task-list',
    );
    const popupCompletedColumn = document.querySelector(
      '#all-task-popup .task-column.completed .task-list',
    );

    if (!popupToDoColumn || !popupInProgressColumn || !popupCompletedColumn) return;
    //clear previous tasks
    popupToDoColumn.innerHTML = '';
    popupInProgressColumn.innerHTML = '';
    popupCompletedColumn.innerHTML = '';
    //add filter task
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);

      switch (task.status) {
        case 'To Do':
          popupToDoColumn.appendChild(taskElement);
          break;
        case 'In Progress':
          popupInProgressColumn.appendChild(taskElement);
          break;
        case 'Completed':
          popupCompletedColumn.appendChild(taskElement);
          break;
      }
    });
    //show message in case no matched results
    if (!popupToDoColumn.children.length) {
      popupToDoColumn.innerHTML = '<p class="no-tasks">No tasks in To Do</p>';
    }
    if (!popupInProgressColumn.children.length) {
      popupInProgressColumn.innerHTML = '<p class="no-tasks">No tasks In Progress</p>';
    }
    if (!popupCompletedColumn.children.length) {
      popupCompletedColumn.innerHTML = '<p class="no-tasks">No Completed tasks</p>';
    }
  }

  // Open/close overlays
  openCreateTaskOverlay() {
    this.createTaskOverlay.classList.remove('hide');
    document.body.classList.add('overflow-hidden');
  }

  closeCreateTaskOverlay() {
    this.createTaskOverlay.classList.add('hide');
    document.body.classList.remove('overflow-hidden');
  }

  openEditTaskOverlay() {
    this.editTaskOverlay.classList.remove('hide');
    document.body.classList.add('overflow-hidden');
  }

  closeEditTaskOverlay() {
    this.editTaskOverlay.classList.add('hide');
    document.body.classList.remove('overflow-hidden');
  }

  // Populate edit form
  populateEditForm(task) {
    document.querySelector('#task-title').value = task.title;
    document.querySelector('#start-date').value = task.startDate;
    document.querySelector('#end-date').value = task.endDate;
    document.querySelector('#textarea').value = task.description;

    // target priority dropdown value
    const priorityContainer = document.querySelector(
      '#edit-task-overlay .priority-select .default-option-container .default-option',
    );
    priorityContainer.textContent = task.priority;

    // Target category dropdown value
    const categoryContainer = document.querySelector(
      '#edit-task-overlay .category-select .default-option-container .default-option',
    );
    categoryContainer.textContent = task.category;
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
