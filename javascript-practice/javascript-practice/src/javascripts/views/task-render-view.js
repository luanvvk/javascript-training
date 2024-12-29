/**
 * This file handle the task of rendering task in the main view and all task overlay
 * It also have function to render the created task to target column: to do, in progress and completed tasks
 * This file also need refinement as there are some repeated codes
 * Cloning node is necessary as one exactly same node cannot be existed at the same time in DOM (board-view and list-view)
 * Function to show no task in columns
 **/

import { createTaskElement } from '../templates/templates.js';

import TaskBaseView from './task-base-view.js';

class TaskRenderView extends TaskBaseView {
  constructor() {
    super();
  }

  // Render tasks in specified views
  renderTasks(tasks, viewTypes = ['mainList', 'mainBoard', 'popupList', 'popupBoard']) {
    viewTypes.forEach((viewType) => {
      this.renderTasksInView(tasks, viewType);
    });
  }

  renderTasksInView(tasks, viewType) {
    const columns = this.columnConfigs[viewType];
    if (!columns) return;

    // Clear all columns
    Object.values(columns).forEach((column) => {
      if (column) column.innerHTML = '';
    });

    // If no tasks, show empty state
    if (!tasks || tasks.length === 0) {
      this.showNoTasksMessages(columns);
      return;
    }
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
}
export default TaskRenderView;
