import TaskBaseController from './task-base-controller.js';

export default class SearchController extends TaskBaseController {
  constructor(model, modalView, renderView) {
    super(model, modalView, renderView);
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
      ? this.renderView.renderAllTasksPopup(filteredTasks)
      : this.renderView.renderTasks(filteredTasks);
  }

  searchTasks(searchText) {
    if (!searchText) return this.tasks;

    return this.tasks.filter((task) => {
      if (!task) return false;

      return ['title', 'description', 'category', 'priority'].some((field) => {
        const value = task[field];
        return value ? value.toString().toLowerCase().includes(searchText) : false;
      });
    });
  }
}
