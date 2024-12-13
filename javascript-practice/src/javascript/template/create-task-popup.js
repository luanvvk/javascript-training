export function createFormElements() {
  // Task Name Input
  const createTaskOverlay = document.getElementById('create-task-overlay');
  const taskNameContainer = createTaskOverlay.querySelector('.task-name');
  taskNameContainer.innerHTML = `
    <h2 class="label">Task title</h2>
    <div class="task-name-container">
      <input type="text" id="task-name-input" class="task-name-input" placeholder="Enter task title" required>
      <img src="./assets/images/icons/create-task-modal-icon/task-title-icon.svg" class="task-name-icon" alt="Task Title Icon">
    </div>
  `;

  // Start Date Input
  const taskStartContainer = createTaskOverlay.querySelector('.task-start');
  taskStartContainer.innerHTML = `
    <h2 class="label">Start date</h2>
    <div class="task-start-container">
    <span class="text-input"></span>
      <input type="date" id="task-start-input" class="task-start-input" required >
      <img src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-start-icon" alt="Start Date Icon">
    </div>
  `;

  // End Date Input
  const taskEndContainer = createTaskOverlay.querySelector('.task-end');
  taskEndContainer.innerHTML = `
    <h2 class="label">End date</h2>
    <div class="task-end-container">
      <span class="text-input"></span>
      <input type="date" id="task-end-input" class="task-end-input" required >
      <img src="./assets/images/icons/create-task-modal-icon/end-date-icon.svg" class="task-end-icon" alt="End Date Icon">
    </div>
  `;

  // Task Description
  const taskDescContainer = createTaskOverlay.querySelector('.task-desc');
  taskDescContainer.innerHTML = `
    <h2 class="label">Task description</h2>
    <textarea id="textarea-input" class="textarea-input" rows="8" placeholder="Enter task description"></textarea>
  `;

  // Button Controls
  const buttonControls = createTaskOverlay.querySelector('.button-controls');
  buttonControls.innerHTML = `
    <button class="add-to-list">Add to list</button>
    <button class="cancel">Cancel</button>
  `;
}
