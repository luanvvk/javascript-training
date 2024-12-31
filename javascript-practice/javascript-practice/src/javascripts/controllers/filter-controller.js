/**
 * This controllers handle the filtering event for the app
 * User can choose the field and the options will be automatically populate the second select input
 * Available fields to filter 'category', 'priority', 'status'
 * User can sort task elements in ascending/descending order
 * Available fields to sort: 'name', 'startDate', 'endDate', 'category', 'priority'
 * sort order toggle func is there to ensure sort order images match asc/desc orders
 */
import { renderSortingUI } from '../templates/templates.js';
import {
  FILTER_OPTIONS,
  VALID_SORT_FIELD,
  PRIORITY_SORT_VALUE,
  SEARCH_TASK_FIELD,
} from '../constants/constants.js';
export default class FilterController {
  constructor(taskController) {
    // Store reference to task controller
    this.taskController = taskController;

    this.currentSortSetting = {
      field: 'name',
      order: 'asc',
    };
    // Initialize DOM elements
    this.initializeDOMElements();
  }
  initializeDOMElements() {
    this.filterFieldDropdown = document.querySelector('.filter__field-dropdown');
    this.filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
    this.sortDropdown = document.querySelector('.sort__dropdown');
    this.sortOrderToggle = document.querySelector('.sort__order-toggle');

    this.setupFilterEventListeners();
    renderSortingUI();
    // Set default sort when opening the popup
    document.querySelector('.app__nav-link--all-tasks').addEventListener('click', () => {
      this.applyDefaultSort();
    });
  }

  setupFilterEventListeners() {
    // Apply event listeners to filters
    this.populateFilterOptions('category');
    if (!this.filterFieldDropdown || !this.filterOptionsDropdown) {
      console.error('Filter dropdown elements not found!');
      return;
    }
    this.filterFieldDropdown.addEventListener('change', (e) => {
      this.populateFilterOptions(e.target.value);
    });
    if (this.filterOptionsDropdown) {
      this.filterOptionsDropdown.addEventListener('change', (e) => {
        e.stopPropagation();
        this.applyFilters.bind(this);
      });
    } else {
      console.error('filterOptionsDropdown not found');
    }

    const searchInputs = document.querySelectorAll('.input-bar-mini__main-input');
    searchInputs.forEach((input) => {
      input.addEventListener('input', this.applyFilters.bind(this));
    });
    //for sorting event listeners
    if (this.sortDropdown) {
      this.sortDropdown.addEventListener('change', this.applyFilters.bind(this));
    }
    if (this.sortOrderToggle) {
      this.sortOrderToggle.removeEventListener('click', this.toggleSortOrderHandler);
      this.toggleSortOrderHandler = this.toggleSortOrder.bind(this);
      this.sortOrderToggle.addEventListener('click', this.toggleSortOrderHandler);
    }
  }

  // Populate the second dropdown based on the first chosen dropdown
  populateFilterOptions(field) {
    this.filterOptionsDropdown.innerHTML = '';

    const options = FILTER_OPTIONS[field] || [];

    // Populate filter options
    this.filterOptionsDropdown.innerHTML = options
      .map((opt) => `<option value="${opt}">${opt}</option>`)
      .join('');

    this.filterOptionsDropdown.addEventListener('change', this.applyFilters.bind(this));
  }

  //Apply filters
  applyFilters() {
    const filterField = this.filterFieldDropdown ? this.filterFieldDropdown.value : 'category';
    const filterValue = this.filterOptionsDropdown ? this.filterOptionsDropdown.value : 'All';
    const searchInput = document.querySelector('.input-bar-mini__main-input');
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let filterKey;
    if (filterField === 'status') {
      filterKey = 'status';
    } else if (filterField === 'priority') {
      filterKey = 'priority';
    } else if (filterField === 'category') {
      filterKey = 'category';
    } else {
      filterKey = 'All';
    }

    const filterOptions = {
      [filterKey]: filterValue,
      searchText: searchText,
    };

    //Filter tasks
    const filteredTasks = this.filterTask(filterOptions);
    this.taskController.renderView.renderTasks(filteredTasks);
  }

  //filter task method
  filterTask(options = {}) {
    const { category = 'All', priority = 'All', status = 'All', searchText = '' } = options;

    // Create a copy of tasks
    let filteredTasks = [...this.taskController.tasks];
    if (searchText) {
      filteredTasks = filteredTasks.filter((task) =>
        SEARCH_TASK_FIELD.some((field) => task[field]?.toLowerCase().includes(searchText)),
      );
    }
    // Filter by category
    if (category !== 'All') {
      filteredTasks = filteredTasks.filter(
        (task) => task.category.toLowerCase() === category.toLowerCase(),
      );
    }
    //Filer by priority
    if (priority !== 'All') {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority.toLowerCase() === priority.toLowerCase(),
      );
    }
    //Filter by status
    if (status !== 'All') {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    return filteredTasks;
  }

  //Sort task method
  applyDefaultSort() {
    const { field, order } = this.currentSortSetting;
    const sortedTasks = this.sortTasks(field, order);
    this.taskController.renderView.renderTasks(sortedTasks);
  }

  sortTasks(field, order) {
    //validate input
    const validFields = VALID_SORT_FIELD;
    if (!validFields.includes(field)) {
      this.showError(`Invalid sort criteria. Please choose one of: ${validFields.join(', ')}`);

      return this.taskController.tasks;
    }
    // Sort handling method:
    const getSortValue = (task, field) => {
      const sortMap = {
        name: task.title?.toLowerCase() || '',
        startDate: new Date(task.startDate || '9999-12-31'),
        endDate: new Date(task.endDate || '9999-12-31'),
        category: task.category?.toLowerCase() || '',
        priority: PRIORITY_SORT_VALUE[task.priority] || 0,
      };
      return sortMap[field];
    };

    const sortedTasks = [...this.taskController.tasks].sort((a, b) => {
      const valueA = getSortValue(a, field);
      const valueB = getSortValue(b, field);

      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    this.taskController.tasks = sortedTasks;
    this.currentSortSetting = { field, order };

    return sortedTasks;
  }

  //change sort order state
  toggleSortOrder(e) {
    e.stopPropagation();

    const currentOrder = this.currentSortSetting.order;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    //update sort order
    this.currentSortSetting.order = newOrder;
    const sortField = this.sortDropdown.value;
    const sortedTasks = this.sortTasks(sortField, newOrder);
    this.taskController.renderTasks(sortedTasks);

    // Update the image source based on the sorting order
    const sortIcon = this.sortOrderToggle.querySelector('.sort__icon');
    if (sortIcon) {
      sortIcon.src =
        newOrder === 'asc'
          ? './assets/images/icons/sort-icons/sort-icon-asc.png'
          : './assets/images/icons/sort-icons/sort-icon-desc.png';
      sortIcon.alt = newOrder === 'asc' ? 'sort-icon-up' : 'sort-icon-down';
    }
  }
}
