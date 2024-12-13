export const createFormElements = {
  taskNameTemplate: (containerId) => `
    <h2 class="label">Task title</h2>
    <div class="task-name-container">
      <input type="text" id="task-name-input" class="task-name-input" placeholder="Enter task title" required>
      <img src="./assets/images/icons/create-task-modal-icon/task-title-icon.svg" class="task-name-icon" alt="Task Title Icon">
    </div>
  `,

  startDateTemplate: (containerId) => `
    <h2 class="label">Start date</h2>
    <div class="task-start-container">
      <span class="text-input"></span>
      <input type="date" id="task-start-input" class="task-start-input" required>
      <img src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-start-icon" alt="Start Date Icon">
    </div>
  `,

  endDateTemplate: (containerId) => `
    <h2 class="label">End date</h2>
    <div class="task-end-container">
      <span class="text-input"></span>
      <input type="date" id="task-end-input" class="task-end-input" required>
      <img src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-end-icon" alt="End Date Icon">
    </div>
  `,

  descriptionTemplate: (containerId) => `
    <h2 class="label">Task description</h2>
    <textarea id="textarea-input" class="textarea-input" rows="8" placeholder="Enter task description"></textarea>
  `,

  buttonControlsTemplate: (containerId) => `
    <button class="add-to-list">Add to list</button>
    <button class="cancel">Cancel</button>
  `,
};

export const createDropdownTemplate = {
  priorityDropdownTemplate: (options) => {
    const defaultOption = options.find((option) => option.default) || options[0];
    return {
      defaultOptionTemplate: `
        <div class="default-option-container">
          <span class="default-option">${defaultOption.value}</span>
          <img src="./assets/images/icons/create-task-modal-icon/priority-icon.svg" class="task-priority-icon" alt="Priority Icon">
        </div>
      `,
      optionsTemplate: options
        .map(
          (option) => `
        <div class="priority-options" data-value="${option.value}">
          ${option.value}
        </div>
      `,
        )
        .join(''),
    };
  },
};
