/**
 * @file task-base-view.js
 * @description This file defines the TaskBaseView class, which serves as a base view for managing task-related views.
 * It initializes properties and DOM elements required for rendering tasks in different views such as main list, main board, popup list, and popup board.
 *
 * @module TaskBaseView
 */

import ErrorHandler from '../helpers/error-handler-utils.js';

class TaskBaseView {
  constructor() {
    this.initializeProperties();
    this.initializeDOMElements();
  }

  /**
   * Initializes properties required for task views.
   * Defines column configurations for all views (main list, main board, popup list, and popup board).
   */

  initializeProperties() {
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

  /**
   * Initializes DOM elements required for task views.
   * Sets up the error handler for displaying error messages.
   */
  initializeDOMElements() {
    this.errorHandler = new ErrorHandler();
  }

  /**
   * Displays an error message using the error handler.
   * @param {string} message - The error message to display.
   */
  showError(message) {
    this.errorHandler.showError(message);
  }
}
export default TaskBaseView;
