/**
 * @file popup-controller.js
 * @description This file is used to handle the task item button actions
 * and also all the button actions of create task and edit task popups.
 * All CRUD operations need to ensure to target the same task element Id before processing.
 *
 * @module PopupController
 */

import { getFormData, getUpdatedTaskData } from '../constants/constants.js';
import { setupPopupDropdowns } from '../templates/templates.js';
import { showNotification } from '../helpers/notifications.js';

export default class PopupController {
  /**
   * Creates an instance of PopupController.
   * @param {Object} taskController - The task controller instance.
   */

  constructor(taskController) {
    if (!taskController) {
      throw new Error('TaskController must be provided to PopupController');
    }

    // Store reference to task controller
    this.taskController = taskController;

    // Verify required dependencies exist
    if (!taskController.modalView) {
      throw new Error('TaskController must have modalView initialized');
    }
    if (!taskController.renderView) {
      throw new Error('TaskController must have renderView initialized');
    }

    this.modalView = this.taskController.modalView;
    this.editTaskOverlay = document.getElementById('edit-task-modal');
    this.createTaskOverlay = document.getElementById('create-task-modal');
    this.handleTaskItemActions();
    this.handlePopupEventListener();
    this.setupOutsideClickHandlers();
    // task deletion state
    setupPopupDropdowns();
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;

    this.deleteConfirmationPopup = document.getElementById('confirmation-popup--delete');
  }

  // Handles task item button actions.
  handleTaskItemActions() {
    this.sideNavbar = document.querySelector('.app__sidebar');
    this.mainBody = document.querySelector('.app-main');
    this.taskColumns = document.querySelectorAll('.task-list');
    // Delegate all task-related events to task columns
    this.taskColumns.forEach((column) => {
      column.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.taskId);
        const task = this.taskController.tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Handle status button clicks
        if (e.target.closest('.status-button')) {
          this.handleStatusChange(task);
        }

        // Handle edit button clicks
        if (e.target.closest('.task-edit')) {
          this.handleTaskEdit(taskItem);
        }

        // Handle delete button clicks
        if (e.target.closest('.task-delete')) {
          this.openDeleteConfirmationPopup(taskId, 'main-view');
        }
      });
    });
  }

  /**
   * Handles the task edit action.
   * Opens the edit task overlay and populates the form with the task data.
   *
   * @param {HTMLElement} taskElement - The task element that was clicked for editing.
   */

  handleTaskEdit(taskElement) {
    const taskId = parseInt(taskElement.dataset.taskId);

    const task = this.taskController.tasks.find((t) => t.id === taskId);
    if (task) {
      setupPopupDropdowns(task);
      this.editTaskOverlay.dataset.taskId = taskId;
      this.modalView.openEditTaskOverlay();
      this.modalView.populateEditForm(task);
    }
  }

  //Change task's status after user clicked the button
  handleStatusChange(task) {
    if (task.status === 'To Do') {
      task.status = 'In Progress';
    } else if (task.status === 'In Progress') {
      task.status = 'Completed';
    } else if (task.status === 'Completed') {
      task.status = 'In Progress';
    }

    this.taskController.renderTasks(this.taskController.tasks);
    this.taskController.saveTasksToLocalStorage();
  }

  //Sets up event listeners for popup actions.
  handlePopupEventListener() {
    this.editTaskOverlay = document.getElementById('edit-task-modal');
    this.createTaskOverlay = document.getElementById('create-task-modal');
    // Delegate all overlay-related events
    this.mainBody.addEventListener('click', (e) => {
      // Create task events
      if (e.target.closest('.board__add-task')) {
        this.handleAddTaskButtonClick();
      }
      if (e.target.closest('.form__button--add')) {
        e.preventDefault();
        this.addTask();
      }

      // form__button--cancel button events
      if (e.target.matches('.form__button--cancel, .modal__close')) {
        const overlay = e.target.closest('.overlay');
        if (overlay.id === 'create-task-modal') {
          this.modalView.closeCreateTaskOverlay();
        } else if (overlay.id === 'edit-task-modal') {
          this.modalView.closeEditTaskOverlay();
        }
      }

      // Edit form submission
      if (e.target.matches('.edit-task-button')) {
        this.handleEditFormSubmission(e);
      }

      // Mark as completed from edit overlay
      if (e.target.matches('.mark-completed')) {
        const taskId = e.target.closest('.overlay').dataset.taskId;
        const task = this.taskController.tasks.find((t) => t.id === parseInt(taskId));
        if (task) {
          task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
          this.taskController.renderTasks(this.taskController.tasks);
          this.taskController.saveTasksToLocalStorage();
          this.modalView.closeEditTaskOverlay();
        }
      }

      // Delete confirmation popup events
      if (e.target.closest('.overlay-delete-button')) {
        const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
        if (!isNaN(taskId)) {
          this.openDeleteConfirmationPopup(taskId, 'edit-overlay');
          this.taskController.renderTasks(this.taskController.tasks);
          this.taskController.saveTasksToLocalStorage();
          this.modalView.closeEditTaskOverlay();
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
  // Handles the add task button click event.
  handleAddTaskButtonClick() {
    this.modalView.openCreateTaskOverlay();
    this.mainBody.classList.remove('active');
    this.sideNavbar.classList.remove('active');
  }

  //Adds a new task.
  addTask() {
    const formData = getFormData();

    const task = new this.taskController.model.constructor(
      formData.title,
      formData.startDate,
      formData.endDate,
      formData.description,
      formData.priority,
      formData.category,
    );

    if (this.taskController.validate(task)) {
      this.taskController.tasks.push(task);
      this.taskController.renderTasks(this.taskController.tasks);
      this.taskController.saveTasksToLocalStorage();
      this.modalView.resetCreateTaskForm();
      this.modalView.closeCreateTaskOverlay();
    }
  }

  /**
   * Handles the edit form submission event.
   * @param {Event} e - The form submission event.
   */

  handleEditFormSubmission(e) {
    e.preventDefault();
    const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
    const task = this.taskController.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask = getUpdatedTaskData(task);

    if (this.taskController.validate(updatedTask)) {
      Object.assign(task, updatedTask);
      this.taskController.saveTasksToLocalStorage();
      this.taskController.renderTasks(this.taskController.tasks);
      this.modalView.closeEditTaskOverlay();
      showNotification('Task successfully edited!', 'success');
    }
  }

  /**
   * Opens the delete confirmation popup.
   * @param {number} taskId - The ID of the task to delete.
   * @param {string} origin - The origin of the delete request.
   */
  openDeleteConfirmationPopup(taskId, origin) {
    this.pendingTaskToDelete = taskId;
    this.deleteOrigin = origin;
    // Show the confirmation popup
    this.deleteConfirmationPopup.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  //Closes the delete confirmation popup.
  closeDeleteConfirmationPopup() {
    this.deleteConfirmationPopup.classList.add('hidden');
    document.body.classList.add('overflow-hidden');
    // Reset pending deletion info
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;
  }

  //Confirms the task deletion.
  confirmTaskDeletion() {
    this.taskController.tasks = this.taskController.tasks.filter(
      (t) => t.id !== this.pendingTaskToDelete,
    );
    showNotification('Task successfully deleted!', 'success');
    this.taskController.renderTasks(this.taskController.tasks);
    this.taskController.saveTasksToLocalStorage();
    this.closeDeleteConfirmationPopup();

    if (this.deleteOrigin === 'all-task-modal') {
      const allTaskPopup = document.getElementById('all-task-modal');
      allTaskPopup.classList.remove('hidden');
    }
  }

  // close popup when clicking outside of modal
  setupOutsideClickHandlers() {
    this.createTaskOverlay.addEventListener('click', (e) => {
      // Check if click is outside the modal container
      if (e.target === this.createTaskOverlay) {
        this.modalView.closeCreateTaskOverlay();
      }
    });

    this.editTaskOverlay.addEventListener('click', (e) => {
      // Check if click is outside the modal container
      if (e.target === this.editTaskOverlay) {
        this.modalView.closeEditTaskOverlay();
      }
    });
  }
}
