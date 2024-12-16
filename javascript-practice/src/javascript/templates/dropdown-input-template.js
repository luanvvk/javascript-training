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
