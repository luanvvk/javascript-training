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
