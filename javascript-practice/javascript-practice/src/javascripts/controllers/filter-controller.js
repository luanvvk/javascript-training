// import TaskRenderView from '../views/task-render-view.js';

export default class FilterController {
  constructor(taskController) {
    this.taskController = taskController;
    this.currentSortSetting = {
      field: 'name',
      order: 'asc',
    };

    this.sortDropdown = document.querySelector('.sort__dropdown');
    this.sortOrderToggle = document.querySelector('.sort__order-toggle');
    this.setupFilterEventListeners();
  }

  setupFilterEventListeners() {
    // Apply event listeners to filters
    console.log('Setting up filter event listeners');
    const filterFieldDropdown = document.querySelector('.filter__field-dropdown');
    const filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
    this.populateFilterOptions('category');
    if (!filterFieldDropdown || !filterOptionsDropdown) {
      console.error('Filter dropdown elements not found!');
      return;
    }
    filterFieldDropdown.addEventListener('change', (e) => {
      this.populateFilterOptions(e.target.value);
      console.log('Dropdown changed:', e.target.value);
    });
    if (this.filterOptionsDropdown) {
      console.log('Dropdown changed:', e.target.value);
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
    const filterOptionsDropdown = document.querySelector('.filter__options-dropdown');
    filterOptionsDropdown.innerHTML = '';

    const options =
      {
        category: ['All', 'Daily Task', 'Weekly Task', 'Monthly Task'],
        priority: ['All', 'Not Urgent', 'Urgent Task', 'Important'],
        status: ['All', 'To Do', 'In Progress', 'Completed'],
      }[field] || [];
    console.log(`Populating options for ${field}:`, options);
    // Populate filter options
    filterOptionsDropdown.innerHTML = options
      .map((opt) => `<option value="${opt}">${opt}</option>`)
      .join('');

    filterOptionsDropdown.addEventListener('change', this.applyFilters.bind(this));
  }

  //Apply filters
  applyFilters() {
    console.log('applyFilters triggered');
    const filterField = this.filterFieldDropdown ? this.filterFieldDropdown.value : 'category';
    const filterValue = this.filterOptionsDropdown ? this.filterOptionsDropdown.value : 'All';
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
    const filteredTasks = this.filterTask(filterOptions);
    console.log('Filtered Tasks:', filteredTasks);
    this.taskController.renderAllTasks(filteredTasks);
  }

  //filter task method
  filterTask(options = {}) {
    const { category = 'All', priority = 'All', status = 'All', searchText = '' } = options;
    console.log('Filtering with options:', options);
    let filteredTasks = this.taskController.tasks;
    if (searchText) {
      filteredTasks = filteredTasks.filter((task) =>
        ['title', 'description', 'category', 'priority'].some((field) =>
          task[field]?.toLowerCase().includes(searchText),
        ),
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
    console.log(filteredTasks);
    console.log('All Tasks:', this.taskController.tasks);
    console.log('Filtered tasks passed to render:', filteredTasks);
    return filteredTasks;
  }

  //Sort task method
  sortTasks(field, order = 'asc') {
    //validate input
    const validFields = ['name', 'startDate', 'endDate', 'category', 'priority'];
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
        priority:
          {
            'Not urgent': 1,
            'Urgent Task': 2,
            Important: 3,
          }[task.priority] || 0,
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
    this.taskController.renderAllTasks(sortedTasks);

    //update button visual state
    this.sortOrderToggle.innerHTML =
      newOrder === 'asc'
        ? ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" />'
        : ' <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-desc.png" alt="sort-icon-down" />';
  }
}
