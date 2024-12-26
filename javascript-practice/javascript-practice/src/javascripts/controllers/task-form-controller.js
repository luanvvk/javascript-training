import TaskModel from '../models/task-model.js';
import { showDeletionNotification } from '../helpers/notifications.js';
import TaskBaseController from './task-base-controller.js';
import TaskModalView from '../views/task-modal-view.js';
import { setupPopupDropdowns } from '../templates/templates.js';
import TaskRenderView from '../views/task-render-view.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';

//Declaration
const sideNavbar = document.querySelector('.search-bar__input-bar');
const mainBody = document.querySelector('.app-main');
const toggle = document.querySelector('.topbar__menu-toggle');
const appLogoHeading = document.querySelector('.app__logo-text');

export default class TaskFormController extends TaskBaseController {
  constructor(model, renderView, errorHandler) {
    super();
    this.model = model || new TaskModel();
    this.renderView = renderView || new TaskRenderView();
    this.modalView = new TaskModalView();
    this.errorHandler = errorHandler || new ErrorHandler();
    this.localStorageUtil = this.localStorageUtil || new LocalStorageUtil('tasks');
    this.setupFormEventListeners();
    this.setupTaskItemActions();
    this.setupSidebarToggleListener();
    this.setupResponsiveDesignListener();
    setupPopupDropdowns();
    this.editTaskOverlay = document.getElementById('edit-task-modal');
    this.confirmTaskDeletion = this.confirmTaskDeletion.bind(this);
    this.deleteConfirmationPopup = document.getElementById('confirmation-popup--delete');

    // task deletion state
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;
  }

  validate(task) {
    try {
      const validationErrors = this.validationUtils.validateTask(task);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => this.errorHandler.showError(error));
        return false;
      }
      return true;
    } catch (error) {
      this.errorHandler.log(`Error validating task: ${error.message}`, 'error');
      return false;
    }
  }

  setupTaskItemActions() {
    this.taskColumns = document.querySelectorAll('.task-list');
    // Delegate all task-related events to task columns
    this.taskColumns.forEach((column) => {
      column.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.taskId);
        const task = this.tasks.find((t) => t.id === taskId);
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
  handleTaskEdit(taskElement) {
    const taskId = parseInt(taskElement.dataset.taskId);

    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      setupPopupDropdowns(task);
      this.editTaskOverlay.dataset.taskId = taskId;
      this.modalView.openEditTaskOverlay();
      this.modalView.populateEditForm(task);
    }
  }

  handleStatusChange(task) {
    if (task.status === 'To Do') {
      task.status = 'In Progress';
    } else if (task.status === 'In Progress') {
      task.status = 'Completed';
    } else if (task.status === 'Completed') {
      task.status = 'In Progress';
    }
    this.renderAllTasks();
    this.saveTasksToLocalStorage();
  }

  // Side bar event
  setupSidebarToggleListener() {
    if (toggle) {
      toggle.addEventListener('click', () => {
        sideNavbar.classList.toggle('active');
        mainBody.classList.toggle('active');
        if (sideNavbar.classList.contains('active')) {
          sideNavbar.classList.add('active');
          appLogoHeading.classList.add('active');
        } else {
          sideNavbar.classList.remove('active');
          appLogoHeading.classList.remove('active');
        }
      });
    }
  }

  setupResponsiveDesignListener() {
    function initCheck(event) {
      if (event.matches) {
        sideNavbar.classList.remove('active');
        mainBody.classList.remove('active');
      } else {
        sideNavbar.classList.add('active');
        mainBody.classList.add('active');
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      let width = window.matchMedia('(min-width: 800px)');
      initCheck(width);
      width.addEventListener('change', initCheck);
    });
  }

  setupFormEventListeners() {
    //   // Delegate all overlay-related events
    //   document.querySelector('.app-main').addEventListener('click', (e) => {
    //     // Create task events
    //     if (e.target.closest('.form__actions .form__button.form__button--add')) {
    //       e.preventDefault();
    //       this.handleAddTask();
    //     }

    //     // form__button--cancel button events
    //     if (e.target.matches('.form__button--cancel, .modal__close')) {
    //       const overlay = e.target.closest('.overlay');
    //       if (overlay.id === 'create-task-modal') {
    //         this.modalView.closeCreateTaskOverlay();
    //       } else if (overlay.id === 'edit-task-modal') {
    //         this.modalView.closeEditTaskOverlay();
    //       }
    //     }

    //     // Edit form submission
    //     if (e.target.matches('.edit-task-button')) {
    //       this.handleEditFormSubmission(e);
    //     }

    //     // Mark as completed from edit overlay
    //     if (e.target.matches('.mark-completed')) {
    //       const taskId = e.target.closest('.overlay').dataset.taskId;
    //       const task = this.tasks.find((t) => t.id === parseInt(taskId));
    //       if (task) {
    //         task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
    //         this.renderAllTasks();
    //         this.saveTasksToLocalStorage();
    //         this.modalView.closeEditTaskOverlay();
    //       }
    //     }

    //     // Delete confirmation popup events
    //     if (e.target.closest('.overlay-delete-button')) {
    //       const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
    //       if (!isNaN(taskId)) {
    //         this.openDeleteConfirmationPopup(taskId, 'edit-overlay');
    //         this.renderAllTasks();
    //         this.saveTasksToLocalStorage();
    //         this.modalView.closeEditTaskOverlay();
    //       }
    //     }
    //     if (e.target.matches('.confirm-delete-btn')) {
    //       this.confirmTaskDeletion();
    //     }
    //     if (e.target.matches('.cancel-delete-btn, #confirmation-popup--delete .modal__close')) {
    //       this.closeDeleteConfirmationPopup();
    //     }
    //   });
    // }

    // handleAddTask() {
    //   const title = document.querySelector('.task-name-input').value.trim();
    //   const startDate = document.querySelector('#task-start-input').value;
    //   const endDate = document.querySelector('#task-end-input').value;
    //   const priority = document
    //     .querySelector('.form__priority-select .default-option')
    //     .textContent.trim();
    //   const category = document
    //     .querySelector('.form__category-select .default-option')
    //     .textContent.trim();
    //   const description = document.querySelector('.textarea-input').value.trim();
    //   const task = new TaskModel(title, startDate, endDate, description, priority, category);

    //   if (this.validate(task)) {
    //     this.tasks.push(task);
    //     this.renderTasks();
    //     this.saveTasksToLocalStorage();
    //     this.modalView.resetCreateTaskForm();
    //     this.modalView.closeCreateTaskOverlay();
    //     this.renderAllTasks();
    //   }
    // }

    // handleEditFormSubmission(e) {
    //   e.preventDefault();
    //   const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
    //   const task = this.tasks.find((t) => t.id === taskId);
    //   if (!task) return;

    //   const updatedTask = {
    //     ...task,
    //     title: document.querySelector('#task-title').value.trim(),
    //     startDate: document.querySelector('#start-date').value,
    //     endDate: document.querySelector('#end-date').value,
    //     description: document.querySelector('#textarea').value.trim(),
    //     priority: document
    //       .querySelector('#edit-task-modal .form__priority-select .default-option')
    //       .textContent.trim(),
    //     category: document
    //       .querySelector('#edit-task-modal .form__category-select .default-option')
    //       .textContent.trim(),
    //     status: document
    //       .querySelector('#edit-task-modal .form__status-select .default-option')
    //       .textContent.trim(),
    //   };
    //   if (this.validate(updatedTask)) {
    //     Object.assign(task, updatedTask);
    //     this.saveTasksToLocalStorage();
    //     this.renderAllTasks();
    //     this.modalView.closeEditTaskOverlay();
    //   }
    // }

    // openDeleteConfirmationPopup(taskId, origin) {
    //   this.pendingTaskToDelete = taskId;
    //   this.deleteOrigin = origin;
    //   // Show the confirmation popup
    //   this.deleteConfirmationPopup.classList.remove('hidden');
    //   document.body.classList.add('overflow-hidden');
    // }

    // confirmTaskDeletion() {
    //   this.tasks = this.tasks.filter((t) => t.id !== this.pendingTaskToDelete);
    //   showDeletionNotification();
    //   this.renderAllTasks();
    //   this.saveTasksToLocalStorage();
    //   this.closeDeleteConfirmationPopup();

    //   if (this.deleteOrigin === 'all-task-modal') {
    //     const allTaskPopup = document.getElementById('all-task-modal');
    //     allTaskPopup.classList.remove('hidden');
    //   }
    // }

    // closeDeleteConfirmationPopup() {
    //   this.deleteConfirmationPopup.classList.add('hidden');
    //   document.body.classList.add('overflow-hidden');
    //   // Reset pending deletion info
    //   this.pendingTaskToDelete = null;
    //   this.deleteOrigin = null;
    // }

    // renderTasks() {
    //   this.renderView.renderTasks(this.tasks);
    // }

    // renderAllTasks() {
    //   // Render all tasks in the All Tasks Popup,
    //   this.renderView.renderAllTasksPopup(this.tasks);
    //   // Render all tasks in the main view
    //   this.renderView.renderTasks(this.tasks);
    // }
    document.querySelector('.app-main').addEventListener('click', (e) => {
      if (e.target.closest('.board__add-task')) {
        this.handleAddTaskButtonClick();
      }
      if (e.target.closest('.form__button--add')) {
        e.preventDefault();
        this.addTask();
      }
      if (e.target.matches('.form__button--cancel, .modal__close')) {
        this.handleCancelButton(e);
      }
      if (e.target.matches('.edit-task-button')) {
        this.handleEditFormSubmission(e);
      }
      if (e.target.matches('.mark-completed')) {
        this.handleStatusButton(e);
      }

      // Delete confirmation popup events
      if (e.target.closest('.overlay-delete-button')) {
        this.handleEditPopupDeletion();
      }

      if (e.target.matches('.confirm-delete-btn')) {
        this.confirmTaskDeletion();
      }
      if (e.target.matches('.cancel-delete-btn, #confirmation-popup--delete .modal__close')) {
        this.closeDeleteConfirmationPopup();
      }
    });
  }

  handleAddTaskButtonClick() {
    this.modalView.openCreateTaskOverlay();
    document.querySelector('.app-main').classList.remove('active');
    document.querySelector('.app__sidebar').classList.remove('active');
  }

  addTask() {
    const taskData = this.getFormData();
    const task = new TaskModel(
      taskData.title,
      taskData.startDate,
      taskData.endDate,
      taskData.description,
      taskData.priority,
      taskData.category,
    );

    if (this.validate(task)) {
      this.tasks.push(task);
      this.renderView.renderTasks(this.tasks);
      this.saveTasksToLocalStorage();
      this.modalView.resetCreateTaskForm();
      this.modalView.closeCreateTaskOverlay();
      this.renderAllTasks(this.tasks);
    }
  }

  getFormData() {
    return {
      title: document.querySelector('.task-name-input').value.trim(),
      startDate: document.querySelector('#task-start-input').value,
      endDate: document.querySelector('#task-end-input').value,
      priority: document.querySelector('.form__priority-select .default-option').textContent.trim(),
      category: document.querySelector('.form__category-select .default-option').textContent.trim(),
      description: document.querySelector('.textarea-input').value.trim(),
    };
  }

  handleCancelButton(e) {
    e.preventDefault();
    const overlay = e.target.closest('.overlay');
    if (overlay.id === 'create-task-modal') {
      this.modalView.closeCreateTaskOverlay();
    } else if (overlay.id === 'edit-task-modal') {
      this.modalView.closeEditTaskOverlay();
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
      this.modalView.closeEditTaskOverlay();
    }
  }

  handleStatusButton(e) {
    e.preventDefault();
    const taskId = e.target.closest('.overlay').dataset.taskId;
    const task = this.tasks.find((t) => t.id === parseInt(taskId));
    if (task) {
      task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
      this.renderAllTasks();
      this.saveTasksToLocalStorage();
      this.modalView.closeEditTaskOverlay();
    }
  }

  handleEditPopupDeletion() {
    const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
    if (!isNaN(taskId)) {
      this.openDeleteConfirmationPopup(taskId, 'edit-overlay');
      this.renderAllTasks();
      this.saveTasksToLocalStorage();
      this.modalView.closeEditTaskOverlay();
    }
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
    this.renderView.renderTasks(this.tasks);
  }

  renderAllTasks() {
    // Render all tasks in the All Tasks Popup,
    this.renderView.renderAllTasksPopup(this.tasks);
    // Render all tasks in the main view
    this.renderView.renderTasks(this.tasks);
  }
}
