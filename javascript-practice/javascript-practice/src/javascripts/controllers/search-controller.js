/**
 * This controller handles the search event for input texts at topbar and in all task popup
 * It will return results which match one of following fields 'title', 'description', 'category', 'priority'
 */
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
    const isPopupSearch = e.target.closest('#all-task-modal') !== null;
    const filteredTasks = this.searchTasks(searchText);

    isPopupSearch
      ? this.taskController.renderView.renderTasks(filteredTasks)
      : this.taskController.renderView.renderTasks(filteredTasks);
  }

  searchTasks(searchText) {
    if (!searchText) return this.taskController.tasks;

    return this.taskController.tasks.filter((task) => {
      if (!task) return false;

      return ['title', 'description', 'category', 'priority'].some((field) => {
        const value = task[field];
        return value ? value.toString().toLowerCase().includes(searchText) : false;
      });
    });
  }
}
