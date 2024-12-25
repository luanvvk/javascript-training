import TaskModel from '../models/task-model.js';
import { showDeletionNotification } from '../helpers/notifications.js';
import ValidationUtils from '../helpers/validation-utils.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import TaskView from '../views/app-view.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';

class TaskActionController {
  constructor(tasks, view, localStorageUtil, errorHandler) {
    this.tasks = tasks;
    this.view = view;
    this.localStorageUtil = localStorageUtil;
    this.errorHandler = errorHandler;
    this.view = new TaskView();
    this.validationUtils = new ValidationUtils();
    this.localStorageUtil = new LocalStorageUtil();
    this.errorHandler = new ErrorHandler();
    this.setupOverlayDelegation();
    this.editTaskOverlay = document.getElementById('edit-task-modal');
    this.confirmTaskDeletion = this.confirmTaskDeletion.bind(this);
    this.deleteConfirmationPopup = document.getElementById('confirmation-popup--delete');
  }

  setupOverlayDelegation() {
    // Delegate all overlay-related events
    document.querySelector('.app-main').addEventListener('click', (e) => {
      // Create task events
      if (e.target.closest('.form__actions .form__button.form__button--add')) {
        e.preventDefault();
        this.handleAddTask();
      }

      // form__button--cancel button events
      if (e.target.matches('.form__button--cancel, .modal__close')) {
        const overlay = e.target.closest('.overlay');
        if (overlay.id === 'create-task-modal') {
          this.view.closeCreateTaskOverlay();
        } else if (overlay.id === 'edit-task-modal') {
          this.view.closeEditTaskOverlay();
        }
      }

      // Edit form submission
      if (e.target.matches('.edit-task-button')) {
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
  }

  handleAddTask() {
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
      this.renderTasks();
      this.saveTasksToLocalStorage();
      this.view.resetCreateTaskForm();
      this.view.closeCreateTaskOverlay();
      this.renderAllTasks();
    }
  }

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

  validate() {
    try {
      const validationErrors = this.validationUtils.validateTask();
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => this.showError(error));
        return false;
      }
      return true;
    } catch (error) {
      this.errorHandler.log(`Error validating task: ${error.message}`, 'error');
    }
  }

  loadDataFromLocalStorage() {
    try {
      this.tasks = this.localStorageUtil.load();
    } catch (error) {
      this.errorHandler.log(`Error loading tasks from local storage: ${error.message}`, 'error');
    }
  }

  saveTasksToLocalStorage() {
    try {
      this.localStorageUtil.save(this.tasks);
    } catch (error) {
      this.errorHandler.log(`Error saving tasks to local storage: ${error.message}`, 'error');
    }
  }

  showError(message) {
    this.errorHandler.showError(message);
  }

  openDeleteConfirmationPopup(taskId, origin) {
    this.pendingTaskToDelete = taskId;
    this.deleteOrigin = origin;
    // Show the confirmation popup
    this.deleteConfirmationPopup.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
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

  closeDeleteConfirmationPopup() {
    this.deleteConfirmationPopup.classList.add('hidden');
    document.body.classList.add('overflow-hidden');
    // Reset pending deletion info
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;
  }

  renderTasks() {
    this.view.renderTasks(this.tasks);
  }

  renderAllTasks() {
    // Render all tasks in the All Tasks Popup,
    this.view.renderAllTasksPopup(this.tasks);
    // Render all tasks in the main view
    this.view.renderTasks(this.tasks);
  }
}
export default TaskActionController;
