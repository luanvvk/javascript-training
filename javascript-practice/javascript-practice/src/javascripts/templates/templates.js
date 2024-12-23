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

// Generic forms for both createTaskPopup and editTaskPopup
export function createFormElements(formType = 'create') {
  //Identify if this is create or edit popup
  const isCreate = formType === 'create';
  const modalId = isCreate ? 'create-task-modal' : 'edit-task-modal';
  const overlay = document.getElementById(modalId);

  //Task name input
  const taskNameContainer = overlay.querySelector('.form__task-name');
  taskNameContainer.innerHTML = `
<label class="form__label" for="${isCreate ? 'task-name-input' : 'task-title'}">Task Title</label>
<div class="task-name-container">
 <input type="text" id="${isCreate ? 'task-name-input' : 'task-title'}" class="task-name-input" ${isCreate ? 'placeholder="Enter task title"' : ''} required />
  <img class="task-name-icon"
       src="./assets/images/icons/create-task-modal-icon/task-title-icon.svg"
       alt="Task Title Icon" 
       />
</div>
`;
  //Start Date input
  const taskStartContainer = overlay.querySelector('.form__task-start');
  taskStartContainer.innerHTML = `
   <label class="form__label" for="${isCreate ? 'task-start-input' : 'start-date'} ">Start Date</label>
  <div class="task-start-container">
    <span class="text-input"></span>
    <input type="date"  id="${isCreate ? 'task-start-input' : 'start-date'}" class="task-start-input" />
     <img class="task-start-icon" src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg"
          alt="Start Date Icon"
      />
  </div>
`;

  // End Date Input
  const taskEndContainer = overlay.querySelector('.form__task-end');
  taskEndContainer.innerHTML = `
   <label class="form__label" for="${isCreate ? 'task-end-input' : 'end-date'} ">End Date</label>
  <div class="task-end-container">
    <span class="text-input"></span>
    <input type="date"  id="${isCreate ? 'task-end-input' : 'end-date'}" class="task-end-input" />
     <img class="task-start-icon" src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg"
          alt="End Date Icon"
      />
  </div>
`;

  //Task Description
  const taskDescContainer = overlay.querySelector('.form__task-desc');
  taskDescContainer.innerHTML = `
  <label class="form__label" for="${isCreate ? 'text-area-input' : 'textarea'}">Task Description</label>
  <textarea id="${isCreate ? 'text-area-input' : 'textarea'}" class="textarea-input" rows="8" placeholder="Enter task description"></textarea>
 `;

  //Button controls
  const buttonControls = overlay.querySelector('.form__actions');
  if (isCreate) {
    buttonControls.innerHTML = `
   <button type="submit" class="btn btn-primary form__button form__button--add">Add to list</button>
    <button type="button" class="btn btn-cancel form__button form__button--cancel">Cancel</button>
  `;
  } else {
    buttonControls.innerHTML = `
  <button type="submit" class="btn btn-primary edit-task-button">Save changes</button>
  <button type="button" class="btn btn-cancel form__button form__button--cancel">Cancel</button>
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

    optionElement.addEventListener('click', (e) => {
      e.stopPropagation();
      container.querySelector('.default-option').textContent = option.value;
      dropdown.style.display = 'none';

      // Dispatch a custom event for the selection
      const event = new CustomEvent('optionSelected', {
        detail: { value: option.value, type: dropdownType },
      });
      container.dispatchEvent(event);
    });

    dropdown.appendChild(optionElement);
  });

  container.appendChild(dropdown);

  let isDropdownVisible = false;

  // Toggle dropdown visibility
  container.addEventListener('click', (e) => {
    // Only toggle if clicking the container itself or the default option
    const clickedDefaultOption = e.target.closest('.default-option-container');
    if (clickedDefaultOption) {
      isDropdownVisible = !isDropdownVisible;

      // Close all other open dropdowns first
      const allDropdowns = document.querySelectorAll(`.${dropdownType}-dropdown`);
      allDropdowns.forEach((d) => d.classList.remove('visible'));

      // Toggle this dropdown
      if (isDropdownVisible) {
        dropdown.classList.add('visible');
        dropdown.style.display = 'flex'; // Show dropdown
      } else {
        dropdown.classList.remove('visible');
        dropdown.style.display = 'none'; // Hide dropdown
      }
      e.stopPropagation();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdown.classList.remove('visible');
      dropdown.style.display = 'none';
      isDropdownVisible = false;
    }
  });

  // Close dropdown when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('visible');
      dropdown.style.display = 'none';
      isDropdownVisible = false;
    }
  });
  return dropdown;
}

export function setupPopupDropdowns() {
  // Priority options
  const priorityOptions = [
    { value: 'Not Urgent', default: true },
    { value: 'Urgent Task', default: false },
    { value: 'Important', default: false },
  ];

  // Category options
  const categoryOptions = [
    { value: 'Daily Task', default: true },
    { value: 'Weekly Task', default: false },
    { value: 'Monthly Task', default: false },
  ];

  // Create dropdowns for create task overlay
  const createPriorityDropdown = createDropdown(
    priorityOptions,
    '.form__task-priority .form__priority-select',
    'priority',
    'create-task-modal',
  );

  const createCategoryDropdown = createDropdown(
    categoryOptions,
    '#create-task-modal .form__task-category .form__category-select',
    'category',
    'create-task-modal',
  );

  // Create dropdowns for edit task overlay
  const editPriorityDropdown = createDropdown(
    priorityOptions,
    '.form__task-priority .form__priority-select',
    'priority',
    'edit-task-modal',
  );

  const editCategoryDropdown = createDropdown(
    categoryOptions,
    '#edit-task-modal .form__task-category .form__category-select',
    'category',
    'edit-task-modal',
  );

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    createPriorityDropdown.style.display = 'none';
    createCategoryDropdown.style.display = 'none';
    editPriorityDropdown.style.display = 'none';
    editCategoryDropdown.style.display = 'none';
  });
}

//SORTING UI
const sortDropdown = document.querySelector('.sort__dropdown');
const filterFieldDropdown = document.querySelector('.filter__field-dropdown');
const sortOrderToggle = document.querySelector('.sort__order-toggle');
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
     <label for="sort__dropdown" class="sort__label">Sort by:</label>
      <div class="sort__dropdown-content">
        <select class="sort__dropdown">
         
        </select>
        <button class="sort__order-toggle"> <img class="sort__icon" src="./assets/images/icons/sort-icons/sort-icon-asc.png" alt="sort-icon-up" /></button>
      </div>
    `;
    document.querySelector('#task-controls').appendChild(sortContainer);
  }
}
