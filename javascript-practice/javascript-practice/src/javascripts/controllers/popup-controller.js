import { showDeletionNotification } from '../helpers/notifications.js';


 function handlePopupEventListener() {
  // Delegate all overlay-related events
  document.querySelector('.app-main').addEventListener('click', (e) => {
    // Create task events
    if (e.target.closest('.board__add-task')) {
      this.handleAddTaskButtonClick();
    };
    if (e.target.closest('.form__button--add')) {
      e.preventDefault();
      this.addTask();
    }

    // form__button--cancel button events
    if (e.target.matches('.form__button--cancel, .modal__close')) {
      const overlay = e.target.closest('.overlay');
      if (overlay.id === DOM_ELEMENTS.CREATE_TASK_MODAL_ID) {
        this.view.closeCreateTaskOverlay();
      } else if (overlay.id === DOM_ELEMENTS.EDIT_TASK_MODAL_ID) {
        this.view.closeEditTaskOverlay();
      }
    }

    // Edit form submission
    if (e.target.matches(DOM_ELEMENTS.EDIT_TASK_BUTTON_SELECTOR)) {
      this.handleEditFormSubmission(e);
    }

    // Mark as completed from edit overlay
    if (e.target.matches('.mark-completed')) {
      const taskId = e.target.closest('.overlay').dataset.taskId;
      const task = this.tasks.find((t) => t.id === parseInt(taskId));
      if (task) {
        task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
        this.renderAllTasks();
        this.saveTasksToLocalStorage();
        this.view.closeEditTaskOverlay();
      }
    }

    // Delete confirmation popup events
    if (e.target.closest('.overlay-delete-button')) {
      const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
      if (!isNaN(taskId)) {
        this.openDeleteConfirmationPopup(taskId, 'edit-overlay');
        this.renderAllTasks();
        this.saveTasksToLocalStorage();
        this.view.closeEditTaskOverlay();
      }
    }
    if (e.target.matches('.confirm-delete-btn')) {
      this.confirmTaskDeletion();
    }
    if (e.target.matches('.cancel-delete-btn, #confirmation-popup--delete .modal__close')) {
      this.closeDeleteConfirmationPopup();
    }
  });
 


 // Handler methods
 handleAddTaskButtonClick() {
  this.view.openCreateTaskOverlay();
  mainBody.classList.remove('active');
  sideNavbar.classList.remove('active');
};

addTask() {
  const title = document.querySelector('.task-name-input').value.trim();
  const startDate = document.querySelector('#task-start-input').value;
  const endDate = document.querySelector('#task-end-input').value;
  const priority = document
    .querySelector('.form__priority-select .default-option')
    .textContent.trim();
  const category = document
    .querySelector('.form__category-select .default-option')
    .textContent.trim();
  const description = document.querySelector('.textarea-input').value.trim();
  const task = new TaskModel(title, startDate, endDate, description, priority, category);

  if (this.validate(task)) {
    this.tasks.push(task);
    this.saveTasksToLocalStorage();
    this.view.resetCreateTaskForm();
    this.view.closeCreateTaskOverlay();
    this.renderAllTasks();
  }
};

handleEditFormSubmission(e) {
  e.preventDefault();
  const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
  const task = this.tasks.find((t) => t.id === taskId);
  if (!task) return;

  const updatedTask = {
    ...task,
    title: document.querySelector('#task-title').value.trim(),
    startDate: document.querySelector('#start-date').value,
    endDate: document.querySelector('#end-date').value,
    description: document.querySelector('#textarea').value.trim(),
    priority: document
      .querySelector('#edit-task-modal .form__priority-select .default-option')
      .textContent.trim(),
    category: document
      .querySelector('#edit-task-modal .form__category-select .default-option')
      .textContent.trim(),
    status: document
      .querySelector('#edit-task-modal .form__status-select .default-option')
      .textContent.trim(),
  };
  if (this.validate(updatedTask)) {
    Object.assign(task, updatedTask);
    this.saveTasksToLocalStorage();
    this.renderAllTasks();
    this.view.closeEditTaskOverlay();
  }
}

openDeleteConfirmationPopup(taskId, origin) {
  this.pendingTaskToDelete = taskId;
  this.deleteOrigin = origin;
  // Show the confirmation popup
  this.deleteConfirmationPopup.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

closeDeleteConfirmationPopup() {
  this.deleteConfirmationPopup.classList.add('hidden');
  document.body.classList.add('overflow-hidden');
  // Reset pending deletion info
  this.pendingTaskToDelete = null;
  this.deleteOrigin = null;
}

confirmTaskDeletion() {
  this.tasks = this.tasks.filter((t) => t.id !== this.pendingTaskToDelete);
  showDeletionNotification();
  this.renderAllTasks();
  this.saveTasksToLocalStorage();
  this.closeDeleteConfirmationPopup();

  if (this.deleteOrigin === 'all-task-modal') {
    const allTaskPopup = document.getElementById('all-task-modal');
    allTaskPopup.classList.remove('hidden');
  }
}