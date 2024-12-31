/**
 * This controller handles the search event for input texts at topbar and in all task popup
 * It will return results which match one of following fields 'title', 'description', 'category', 'priority'
 */
import { SEARCH_TASK_FIELD } from '../constants/constants.js';
export default class SearchController {
  constructor(taskController) {
    // Store reference to task controller
    this.taskController = taskController;
    this.setupSearchListeners();
  }

  setupSearchListeners() {
    const searchInputs = document.querySelectorAll(
      '.input-bar__main-input, .input-bar-mini__main-input',
    );
    searchInputs.forEach((input) => {
      input.addEventListener('input', (e) => this.handleSearch(e));
    });
  }

  handleSearch(e) {
    const searchText = e.target.value.toLowerCase().trim();
    const filteredTasks = this.searchTasks(searchText);

    this.taskController.renderView.renderTasks(filteredTasks);
  }

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
