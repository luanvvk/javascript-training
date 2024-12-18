//TASK BODY TEMPLATE
import { formatDate } from '../helpers/format-date-utils.js';
import { calculateTaskDuration } from '../helpers/format-date-utils.js';
// Create task HTML element
export function createTaskElement(task) {
  let buttonIconSrc;
  let buttonText;
  if (task.status === 'To Do') {
    buttonIconSrc = './assets/images/icons/task-icons/todo-task-icon.svg';
    buttonText = 'Mark as In Progress';
  } else if (task.status === 'In Progress') {
    buttonIconSrc = './assets/images/icons/task-icons/running-task-icon.png';
    buttonText = 'Mark as Completed';
  } else if (task.status === 'Completed') {
    buttonIconSrc = './assets/images/icons/task-icons/completed-task-icon.svg';
    buttonText = 'Mark as In Progress';
  }
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = `
    <li class="task-item" data-task-id="${task.id}">
    <div class="task-item__details">
      <h3 class="task-item__heading">${task.title}</h3>
      <h4 class="start-date">Start date: ${formatDate(task.startDate)}</h4>
      <h4 class="end-date">End date: ${formatDate(task.endDate)}</h4>
      <div class="task-duration">
        <span class="duration-badge">Duration: ${calculateTaskDuration(task.startDate, task.endDate)}</span>
      </div>
      <button class="status-button">
        <img class="button-icon" src="${buttonIconSrc}" alt="button-icon" loading="lazy" />
        <span class="confirm-button-desc">${buttonText}</span>
      </button>
    </div>
    <div class="task-item-actions">
      <a class="task-edit" href="javascript:void(0)">
        <img class="task-edit-icon" src="./assets/images/icons/task-icons/task-edit-icon.svg" alt="task-edit-icon" />
      </a>
      <a class="task-delete" href="javascript:void(0)">
        <img class="task-delete-icon" src="./assets/images/icons/task-icons/task-delete-icon.svg" alt="task-delete-icon" />
      </a>
    </li>`;
  return tempDiv.firstElementChild;
}

// ALL TASK POPUP
export function createAllTasksListView(tasks) {
  // Create main container for list view
  const listViewContainer = document.createElement('div');
  listViewContainer.classList.add('all-tasks-list-view');

  // Create table structure
  const table = document.createElement('table');
  table.classList.add('tasks-list-table');

  // Create table header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Title</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Priority</th>
      <th>Category</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  tasks.forEach((task) => {
    const row = document.createElement('tr');
    row.dataset.taskId = task.id;
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.startDate || 'N/A'}</td>
      <td>${task.endDate || 'N/A'}</td>
      <td>
        <span class="priority-badge priority-${task.priority.toLowerCase().replace(/\s+/g, '-')}">
          ${task.priority}
        </span>
      </td>
      <td>${task.category}</td>
      <td>
        <span class="status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}">
          ${task.status}
        </span>
      </td>
      <td>
        <div class="task-list-actions">
          <button class="task-edit" aria-label="Edit Task">
            <img src="./assets/images/icons/edit-icon.svg" alt="Edit"/>
          </button>
          <button class="task-delete" aria-label="Delete Task">
            <img src="./assets/images/icons/delete-icon.svg" alt="Delete"/>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  listViewContainer.appendChild(table);

  return listViewContainer;
}

// ALL TASK POPUP
export function createFormElements() {
  // Task Name Input
  const createTaskOverlay = document.getElementById('create-task-overlay');
  const taskNameContainer = createTaskOverlay.querySelector('.task-name');
  taskNameContainer.innerHTML = `
    <label class="label" for="task-name-input">Task Title</label>
    <div class="task-name-container">
      <input type="text" id="task-name-input" class="task-name-input" placeholder="Enter task title" required>
      <img src="./assets/images/icons/create-task-modal-icon/task-title-icon.svg" class="task-name-icon" alt="Task Title Icon">
    </div>
  `;

  // Start Date Input
  const taskStartContainer = createTaskOverlay.querySelector('.task-start');
  taskStartContainer.innerHTML = `
    <label class="label" for="task-start-input">Start Date</label>
    <div class="task-start-container">
    <span class="text-input"></span>
      <input type="date" id="task-start-input" class="task-start-input" required >
      <img src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-start-icon" alt="Start Date Icon">
    </div>
  `;

  // End Date Input
  const taskEndContainer = createTaskOverlay.querySelector('.task-end');
  taskEndContainer.innerHTML = `
    <label class="label" for="task-end-input">End Date</label>
    <div class="task-end-container">
      <span class="text-input"></span>
      <input type="date" id="task-end-input" class="task-end-input" required >
      <img src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-end-icon" alt="End Date Icon">
    </div>
  `;

  // Task Description
  const taskDescContainer = createTaskOverlay.querySelector('.task-desc');
  taskDescContainer.innerHTML = `
    <label class="label" for="textarea-input">Task Description</label>
    <textarea id="textarea-input" class="textarea-input" rows="5" placeholder="Enter task description"></textarea>
  `;

  // Button Controls
  const buttonControls = createTaskOverlay.querySelector('.button-controls');
  buttonControls.innerHTML = `
    <button type="submit" class="btn btn-primary add-to-list">Add to list</button>
    <button type="button" class="btn btn-cancel cancel">Cancel</button>
  `;
}

// TEMPLATE FOR DROPDOWN INPUT
export function createDropdown(options, containerSelector, dropdownType, overlayId) {
  const overlay = document.getElementById(overlayId);
  const container = overlay.querySelector(containerSelector);
  const dropdown = document.createElement('div');
  dropdown.classList.add(`${dropdownType}-dropdown`);

  // Find default option
  const defaultOption = options.find((option) => option.default) || options[0];

  // Create default option container
  container.innerHTML = `
    <div class="default-option-container">
      <span class="default-option">${defaultOption.value}</span>
      <img src="./assets/images/icons/create-task-modal-icon/priority-icon.svg" 
           class="${dropdownType}-icon" 
           alt="${dropdownType.charAt(0).toUpperCase() + dropdownType.slice(1)} Icon">
    </div>
  `;

  // Create dropdown options
  options.forEach((option) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add(`${dropdownType}-options`);
    optionElement.textContent = option.value;
    optionElement.addEventListener('click', () => {
      container.querySelector('.default-option').textContent = option.value;
      dropdown.style.display = 'none';
    });
    dropdown.appendChild(optionElement);
  });

  container.appendChild(dropdown);

  // Toggle dropdown visibility
  container.addEventListener('click', (e) => {
    dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
    e.stopPropagation();
  });

  return dropdown;
}

export function setupPopupDropdowns() {
  // Priority options
  const priorityOptions = [
    { value: 'Not urgent', default: true },
    { value: 'Urgent task', default: false },
    { value: 'Important', default: false },
  ];

  // Category options
  const categoryOptions = [
    { value: 'Daily Task', default: true },
    { value: 'Weekly task', default: false },
    { value: 'Monthly task', default: false },
  ];

  // Create dropdowns for create task overlay
  const createPriorityDropdown = createDropdown(
    priorityOptions,
    '.task-priority .priority-select',
    'priority',
    'create-task-overlay',
  );

  const createCategoryDropdown = createDropdown(
    categoryOptions,
    '#create-task-overlay .task-category-input .category-select',
    'category',
    'create-task-overlay',
  );

  // Create dropdowns for edit task overlay
  const editPriorityDropdown = createDropdown(
    priorityOptions,
    '.task-priority .priority-select',
    'priority',
    'edit-task-overlay',
  );

  const editCategoryDropdown = createDropdown(
    categoryOptions,
    '#edit-task-overlay .task-category-input .category-select',
    'category',
    'edit-task-overlay',
  );

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    createPriorityDropdown.style.display = 'none';
    createCategoryDropdown.style.display = 'none';
    editPriorityDropdown.style.display = 'none';
    editCategoryDropdown.style.display = 'none';
  });
}

// EDIT TASK POPUP
export function editFormElements() {
  // Task Name Input
  const editTaskOverlay = document.getElementById('edit-task-overlay');
  const taskNameContainer = editTaskOverlay.querySelector('.task-name');
  taskNameContainer.innerHTML = `
     <label class="label" for="task-title">Task Title</label>
    <div class="task-name-container">
      <input type="text" name="task-name" id="task-title" class="task-name-input" required />
       <img class="task-name-icon"
            src="./assets/images/icons/create-task-modal-icon/task-title-icon.svg"
            alt="task-name-icon" 
            />
    </div>
  `;
  // Start Date Input
  const taskStartContainer = editTaskOverlay.querySelector('.task-start');
  taskStartContainer.innerHTML = `
     <label class="label" for="start-date">Start Date</label>
    <div class="task-start-container">
      <span class="text-input"></span>
      <input type="date" name="task-start" id="start-date" class="task-start-input" />
       <img class="task-start-icon" src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg"
            alt="task-start-icon"
        />
    </div>
  `;

  // End Date Input
  const taskEndContainer = editTaskOverlay.querySelector('.task-end');
  taskEndContainer.innerHTML = `
      <label class="label" for="end-date">End Date</label>
    <div class="task-end-container">
      <span class="text-input"></span>
      <input type="date" name="task-end" id="end-date" class="task-end-input" />
      <img class="task-end-icon"
           src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg"
          alt="task-end-icon"
      />
    </div>
  `;

  // Task Description
  const taskDescContainer = editTaskOverlay.querySelector('.task-desc');
  taskDescContainer.innerHTML = `
    <label class="label" for="description">Task Description</label>
    <textarea id="textarea" class="textarea-input" rows="8" placeholder="Enter task description"></textarea>
   `;

  // Button Controls
  const buttonControls = editTaskOverlay.querySelector('.edit-controls');
  buttonControls.innerHTML = `
    <button type="submit" class="btn btn-primary edit-task-button">Save changes</button>
    <button type="button" class="btn btn-cancel cancel">Cancel</button>
    <button type="button" class="btn btn-success mark-completed" >
      <img
      class="move-task-icon"
      src="./assets/images/icons/task-edit-modal-icons/mark-as-completed-icon.svg"
      alt=""
      />
      Mark as completed
    </button>
    <button type="button" class="btn btn-secondary overlay-delete-button">
      <img
      class="delete-task-icon"
      src="./assets/images/icons/task-edit-modal-icons/task-delete-icon.svg"
      alt=""
      />
    Delete the task
    </button>
  `;
}

//SORTING UI
const sortDropdown = document.querySelector('.sort-dropdown');
const filterFieldDropdown = document.querySelector('.filter-field-dropdown');
const sortOrderToggle = document.querySelector('.sort-order-toggle');
export function renderSortingUI() {
  if (sortDropdown) {
    sortDropdown.innerHTML = '';
    const sortOptions = [
      { value: 'name', label: 'By name' },
      { value: 'startDate', label: 'By start date' },
      { value: 'endDate', label: 'By end date' },
      { value: 'priority', label: 'By priority' },
      { value: 'category', label: 'By category' },
    ];
    sortOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      sortDropdown.appendChild(optionElement);
    });
  }
  //Render filter field dropdown
  if (filterFieldDropdown) {
    filterFieldDropdown.innerHTML = '';
    const filterFieldOptions = [
      { value: 'category', label: 'Category' },
      { value: 'priority', label: 'Priority' },
      { value: 'status', label: 'Status' },
    ];
    filterFieldOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      filterFieldDropdown.appendChild(optionElement);
    });
  }
  //Add sort order toggle
  if (!sortOrderToggle) {
    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');
    sortContainer.innerHTML = `
     <label for="sort-dropdown" class="sort-label">Sort by:</label>
      <div class="sort-dropdown-content">
        <select class="sort-dropdown">
         
        </select>
        <button class="sort-order-toggle"> <img class="sort-icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" /></button>
      </div>
    `;
    document.querySelector('#task-controls').appendChild(sortContainer);
  }
}
