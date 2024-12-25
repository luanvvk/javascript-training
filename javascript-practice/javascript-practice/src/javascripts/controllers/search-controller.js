class SearchController {
  constructor(tasks, view) {
    this.tasks = tasks;
    this.view = view;
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
      ? this.view.renderAllTasksPopup(filteredTasks)
      : this.view.renderTasks(filteredTasks);
  }

  searchTasks(searchText) {
    if (!searchText) return this.tasks;

    return this.tasks.filter((task) =>
      ['title', 'description', 'category', 'priority'].some((field) =>
        task[field].toLowerCase().includes(searchText),
      ),
    );
  }
}
export default SearchController;
