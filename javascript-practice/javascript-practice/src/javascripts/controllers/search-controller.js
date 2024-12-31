/**
 * @file search-controller.js
 * @description This controller handles the search functionality
 * for input texts in the top bar and in the all tasks popup.
 * It filters tasks based on the search text and updates the view with the filtered results.
 *
 * The search functionality matches the search text against the following fields:
 * - title
 * - description
 * - category
 * - priority
 *
 * @module SearchController
 */

import { SEARCH_TASK_FIELD } from '../constants/constants.js';
export default class SearchController {
  /**
   * Creates an instance of SearchController.
   * @param {Object} taskController - The task controller instance.
   */

  constructor(taskController) {
    // Store reference to task controller
    this.taskController = taskController;
    this.setupSearchListeners();
  }

  // Sets up event listeners for search inputs.
  setupSearchListeners() {
    const searchInputs = document.querySelectorAll(
      '.input-bar__main-input, .input-bar-mini__main-input',
    );
    searchInputs.forEach((input) => {
      input.addEventListener('input', (e) => this.handleSearch(e));
    });
  }

  /**
   * Handles the search event.
   * Filters tasks based on the search text and updates the view with the filtered results.
   * @param {Event} e - The input event.
   */
  handleSearch(e) {
    const searchText = e.target.value.toLowerCase().trim();
    const filteredTasks = this.searchTasks(searchText);

    this.taskController.renderView.renderTasks(filteredTasks);
  }

  /**
   * Filters tasks based on the search text.
   * @param {string} searchText - The search text.
   * @returns {Array} The filtered tasks.
   */
  searchTasks(searchText) {
    if (!searchText) return this.taskController.tasks;

    return this.taskController.tasks.filter((task) => {
      if (!task) return false;

      return SEARCH_TASK_FIELD.some((field) => {
        const value = task[field];
        return value ? value.toString().toLowerCase().includes(searchText) : false;
      });
    });
  }
}
