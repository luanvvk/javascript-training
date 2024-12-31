/**
 * @file task-render-view.js
 * @description This file handles the task of rendering tasks in the main view and all task overlay.
 * It also has functions to render the created task to the target column: to do, in progress, and completed tasks.
 * Cloning nodes is necessary as one exactly same node cannot exist at the same time in the DOM (board-view and list-view).
 * It also includes a function to show a message when there are no tasks in the columns.
 *
 * @module TaskRenderView
 */

import { createTaskElement } from '../templates/templates.js';

import TaskBaseView from './task-base-view.js';

class TaskRenderView extends TaskBaseView {
  constructor() {
    super();
  }

  /**
   * Renders tasks in specified views.
   * @param {Array} tasks - The tasks to render.
   * @param {Array} [viewTypes=['mainList', 'mainBoard', 'popupList', 'popupBoard']] - The views to render tasks in.
   */
  renderTasks(tasks, viewTypes = ['mainList', 'mainBoard', 'popupList', 'popupBoard']) {
    viewTypes.forEach((viewType) => {
      this.renderTasksInView(tasks, viewType);
    });
  }

  /**
   * Renders tasks in a specific view.
   * @param {Array} tasks - The tasks to render.
   * @param {string} viewType - The type of view to render tasks in.
   */
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

  /**
   * Gets the appropriate column for a task based on its status.
   * @param {string} status - The status of the task.
   * @param {Object} columns - The columns configuration.
   * @returns {HTMLElement} The column element.
   */
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

  /**
   * Shows a message when there are no tasks in the columns.
   * @param {Object} columns - The columns configuration.
   */
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
