import { createTaskElement } from '../templates/templates.js';
import { showNoTasksMessage } from '../helpers/notifications.js';
import { formatDate } from '../helpers/format-date-utils.js';
import TaskController from '../controllers/app-controller.js';
class TaskView {
  constructor() {
    this.listViewColumns = {
      toDo: document.querySelector('.list-view .task-column.pink .task-list'),
      running: document.querySelector('.list-view .task-column.blue .task-list'),
      completed: document.querySelector('.list-view .task-column.green .task-list'),
    };

    this.boardViewColumns = {
      toDo: document.querySelector('.board-view .task-column.pink .task-list'),
      running: document.querySelector('.board-view .task-column.blue .task-list'),
      completed: document.querySelector('.board-view .task-column.green .task-list'),
    };

    this.createTaskOverlay = document.getElementById('create-task-overlay');
    this.editTaskOverlay = document.getElementById('edit-task-overlay');
    this.notification = document.querySelector('.notification');
    this.sortDropdown = document.querySelector('.sort-dropdown');
    this.sortOrderToggle = document.querySelector('.sort-order-toggle');
    this.filterFieldDropdown = document.querySelector('.filter-field-dropdown');
    this.filterOptionsDropdown = document.querySelector('.filter-options-dropdown');
  }

  // Render tasks in both views
  renderTasks(tasks) {
    // Clear previous tasks
    Object.values(this.listViewColumns).forEach((column) => (column.innerHTML = ''));
    Object.values(this.boardViewColumns).forEach((column) => (column.innerHTML = ''));

    // Render tasks in appropriate columns
    tasks.forEach((task) => {
      const taskHTML = createTaskElement(task);

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

  //render all task popup
  renderAllTasksPopup(tasks) {
    //board view
    const popupBoardToDoColumn = document.querySelector(
      '#all-task-popup .board-view.task-columns .task-column.todo .task-list',
    );
    const popupBoardInProgressColumn = document.querySelector(
      '#all-task-popup .board-view.task-columns .task-column.in-progress .task-list',
    );
    const popupBoardCompletedColumn = document.querySelector(
      '#all-task-popup .board-view.task-columns .task-column.completed .task-list',
    );

    if (!popupBoardToDoColumn || !popupBoardInProgressColumn || !popupBoardCompletedColumn) return;
    //clear previous tasks
    popupBoardToDoColumn.innerHTML = '';
    popupBoardInProgressColumn.innerHTML = '';
    popupBoardCompletedColumn.innerHTML = '';
    //add filter task
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);

      switch (task.status) {
        case 'To Do':
          popupBoardToDoColumn.appendChild(taskElement);
          break;
        case 'In Progress':
          popupBoardInProgressColumn.appendChild(taskElement);
          break;
        case 'Completed':
          popupBoardCompletedColumn.appendChild(taskElement);
          break;
      }
    });
    //show message in case no matched results
    this.showNoTasksInColumns([
      { column: popupBoardToDoColumn, message: 'No tasks in To Do' },
      { column: popupBoardInProgressColumn, message: 'No tasks In Progress' },
      { column: popupBoardCompletedColumn, message: 'No Completed tasks' },
    ]);

    //list view
    const popupListToDoColumn = document.querySelector(
      '#all-task-popup .list-view.task-columns .task-column.todo .task-list',
    );
    const popupListInProgressColumn = document.querySelector(
      '#all-task-popup .list-view.task-columns .task-column.in-progress .task-list',
    );
    const popupListCompletedColumn = document.querySelector(
      '#all-task-popup .list-view.task-columns .task-column.completed .task-list',
    );

    if (!popupListToDoColumn || !popupListInProgressColumn || !popupListCompletedColumn) return;
    //clear previous tasks
    popupListToDoColumn.innerHTML = '';
    popupListInProgressColumn.innerHTML = '';
    popupListCompletedColumn.innerHTML = '';
    //add filter task
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);

      switch (task.status) {
        case 'To Do':
          popupListToDoColumn.appendChild(taskElement);
          break;
        case 'In Progress':
          popupListInProgressColumn.appendChild(taskElement);
          break;
        case 'Completed':
          popupListCompletedColumn.appendChild(taskElement);
          break;
      }
    });
    //show message in case no matched results
    this.showNoTasksInColumns([
      { column: popupListToDoColumn, message: 'No tasks in To Do' },
      { column: popupListInProgressColumn, message: 'No tasks In Progress' },
      { column: popupListCompletedColumn, message: 'No Completed tasks' },
    ]);
  }

  showNoTasksInColumns(columnConfigs) {
    columnConfigs.forEach(({ column, message }) => {
      if (!column.children.length) {
        column.innerHTML = `<li class="no-tasks-message"><span>${message}</span></li>`;
      }
    });
  }

  //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  // Open/close overlays
  openCreateTaskOverlay() {
    this.createTaskOverlay.classList.toggle('hide');
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
    const allTaskPopup = document.getElementById('all-task-popup');
    if (!allTaskPopup.classList.contains('hide')) {
      this.editTaskOverlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    } else {
      this.editTaskOverlay.classList.add('hide');
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
