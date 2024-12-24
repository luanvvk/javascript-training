import { createTaskElement } from '../templates/templates.js';
import { showNoTasksMessage } from '../helpers/notifications.js';
import TaskBaseView from './task-base-view.js';

class TaskRenderView extends TaskBaseView {
  // Render tasks in both views
  renderTasks(tasks) {
    this.clearColumns();
    tasks.forEach((task) => this.renderTask(task));
    this.showEmptyStateMessages();
  }
  // Clear any previous tasks
  clearColumns() {
    [...Object.values(this.listViewColumns), ...Object.values(this.boardViewColumns)].forEach(
      (column) => (column.innerHTML = ''),
    );
  }

  // Render tasks in appropriate columns
  renderTask(task) {
    const taskHTML = createTaskElement(task);

    switch (task.status) {
      case 'To Do':
        this.listViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
        this.boardViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
        break;
      case 'In Progress':
        this.listViewColumns['In Progress'].appendChild(taskHTML.cloneNode(true));
        this.boardViewColumns['In Progress'].appendChild(taskHTML.cloneNode(true));
        break;
      case 'Completed':
        this.listViewColumns.completed.appendChild(taskHTML.cloneNode(true));
        this.boardViewColumns.completed.appendChild(taskHTML.cloneNode(true));
        break;
    }
  }
  // Show a "no tasks" message if columns are empty
  showEmptyStateMessages() {
    showNoTasksMessage(this.listViewColumns, 'list-view');
    showNoTasksMessage(this.boardViewColumns, 'board-view');
  }

  //render all task popup
  renderAllTasksPopup(tasks) {
    //board view
    const popupBoardToDoColumn = document.querySelector(
      '#all-task-modal .board-view.task-columns .task-column.todo .task-list',
    );
    const popupBoardInProgressColumn = document.querySelector(
      '#all-task-modal .board-view.task-columns .task-column.in-progress .task-list',
    );
    const popupBoardCompletedColumn = document.querySelector(
      '#all-task-modal .board-view.task-columns .task-column.completed .task-list',
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
      '#all-task-modal .list-view.task-columns .task-column.todo .task-list',
    );
    const popupListInProgressColumn = document.querySelector(
      '#all-task-modal .list-view.task-columns .task-column.in-progress .task-list',
    );
    const popupListCompletedColumn = document.querySelector(
      '#all-task-modal .list-view.task-columns .task-column.completed .task-list',
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
}
export default TaskRenderView;
