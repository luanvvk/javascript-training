import TaskBaseController from './task-base-controller.js';

export default class FilterController extends TaskBaseController {
  constructor(modalView, renderView, model) {
    super(modalView, renderView, model);

    this.currentSortSetting = {
      field: 'name',
      order: 'asc',
    };

    this.setupFilterEventListeners();
  }

  setupFilterEventListeners() {
    const filterField = document.querySelector('.filter__field-dropdown');
    const filterOptions = document.querySelector('.filter__options-dropdown');
    const sortDropdown = document.querySelector('.sort__dropdown');
    const sortOrderToggle = document.querySelector('.sort__order-toggle');

    filterField?.addEventListener('change', (e) => {
      this.populateFilterOptions(e.target.value);
    });

    filterOptions?.addEventListener('change', () => this.applyFilters());

    sortDropdown?.addEventListener('change', () => this.applyFilters());

    sortOrderToggle?.addEventListener('click', (e) => this.toggleSortOrder(e));
  }

  // Populate the second dropdown based on the first chosen dropdown
  populateFilterOptions(field) {
    const filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
    filterOptionsDropdown.innerHTML = '';

    let options = [];
    switch (field) {
      case 'category':
        options = ['All', 'Daily Task', 'Weekly Task', 'Monthly Task'];
        break;
      case 'priority':
        options = ['All', 'Not Urgent', 'Urgent Task', 'Important'];
        break;
      case 'status':
        options = ['All', 'To Do', 'In Progress', 'Completed'];
        break;
      default:
        options = ['All'];
    }

    // Populate filter options
    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      filterOptionsDropdown.appendChild(optionElement);
    });
    // Re-apply filters with default "All"
    this.applyFilters();
  }

  applyFilters() {
    const filterFieldDropdown = document.querySelector('.filter__field-dropdown');
    const filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
    //navigate/toggle elements
    const filterField = filterFieldDropdown ? filterFieldDropdown.value : 'category';
    const filterValue = filterOptionsDropdown ? filterOptionsDropdown.value : 'All';
    const searchInput = document.querySelector('.input-bar-mini__main-input');
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filterOptions = {
      [filterField === 'status'
        ? 'status'
        : filterField === 'priority'
          ? 'priority'
          : filterField === 'category'
            ? 'category'
            : 'All']: filterValue,
      searchText: searchText,
    };

    //Filter tasks
    const filteredTasks = this.filterTasks(filterOptions);
    this.renderView.renderAllTasksPopup(filteredTasks);
    this.renderView.renderTasks(filteredTasks);
  }

  filterTasks(options) {
    return this.tasks.filter((task) => {
      const matchesCategory = options.category === 'All' || task.category === options.category;
      const matchesPriority = options.priority === 'All' || task.priority === options.priority;
      const matchesStatus = options.status === 'All' || task.status === options.status;

      return matchesCategory && matchesPriority && matchesStatus;
    });
  }

  sortTasks(tasks) {
    const { field, order } = this.currentSortSetting;
    //validate input
    const validFields = ['name', 'startDate', 'endDate', 'category', 'priority'];
    if (!validFields.includes(field)) {
      this.showError(`Invalid sort criteria. Please choose one of: ${validFields.join(', ')}`);

      return this.tasks;
    }

    return [...tasks].sort((a, b) => {
      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
    // Sort handling method:
  }
  getSortValue = (task, field) => {
    const sortMap = {
      name: () => task.title.toLowerCase(),
      startDate: () => new Date(task.startDate || '9999-12-31'),
      endDate: () => new Date(task.endDate || '9999-12-31'),
      category: () => task.category.toLowerCase(),
      priority: () => {
        const priorityOrder = {
          'Not urgent': 1,
          'Urgent Task': 2,
          Important: 3,
        };
        return priorityOrder[task.priority] || 0;
      },
    };
    return sortMap[field]();
  };

  //change sort order state
  toggleSortOrder(e) {
    e.stopPropagation();

    const currentOrder = this.currentSortSetting.order;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    //update sort order
    this.currentSortSetting.order = newOrder;
    const sortField = this.sortDropdown.value;
    const sortedTasks = this.sortTasks(sortField, newOrder);

    this.renderView.renderTasks(sortedTasks);
    this.renderView.renderAllTasksPopup(sortedTasks);

    //update button visual state
    this.sortOrderToggle.innerHTML =
      newOrder === 'asc'
        ? ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" />'
        : ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-desc.png" alt="sort-icon-down" />';
  }
}
