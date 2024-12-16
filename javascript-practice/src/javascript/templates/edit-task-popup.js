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
