import { showNotification } from '../helpers/notifications.js';

export default class PopupController {
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

    this.handleTaskItemActions();
    this.handlePopupEventListener();
    // task deletion state
    this.pendingTaskToDelete = null;
    this.deleteOrigin = null;

    this.deleteConfirmationPopup = document.getElementById('confirmation-popup--delete');
  }

  handleTaskItemActions() {
    this.sideNavbar = document.querySelector('.app__sidebar');
    this.editTaskOverlay = document.getElementById('edit-task-modal');
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

  handleTaskEdit(taskElement) {
    const taskId = parseInt(taskElement.dataset.taskId);

    const task = this.taskController.tasks.find((t) => t.id === taskId);
    if (task) {
      this.taskController.setupPopupDropdowns(task);
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

    this.taskController.renderAllTasks(this.taskController.tasks);
    this.taskController.saveTasksToLocalStorage();
  }

  handlePopupEventListener() {
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
          this.taskController.renderAllTasks(this.taskController.tasks);
          this.taskController.saveTasksToLocalStorage();
          this.modalView.closeEditTaskOverlay();
        }
      }

      // Delete confirmation popup events
      if (e.target.closest('.overlay-delete-button')) {
        const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
        if (!isNaN(taskId)) {
          this.openDeleteConfirmationPopup(taskId, 'edit-overlay');
          this.taskController.renderAllTasks(this.taskController.tasks);
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
  // Handler methods
  handleAddTaskButtonClick() {
    this.modalView.openCreateTaskOverlay();
    this.mainBody.classList.remove('active');
    this.sideNavbar.classList.remove('active');
  }
  addTask() {
    const formData = {
      title: document.querySelector('.task-name-input').value.trim(),
      startDate: document.querySelector('#task-start-input').value,
      endDate: document.querySelector('#task-end-input').value,
      priority: document.querySelector('.form__priority-select .default-option').textContent.trim(),
      category: document.querySelector('.form__category-select .default-option').textContent.trim(),
      description: document.querySelector('.textarea-input').value.trim(),
    };

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
      this.taskController.renderAllTasks(this.taskController.tasks);
      this.taskController.saveTasksToLocalStorage();
      this.modalView.resetCreateTaskForm();
      this.modalView.closeCreateTaskOverlay();
    }
  }

  handleEditFormSubmission(e) {
    e.preventDefault();
    const taskId = parseInt(this.editTaskOverlay.dataset.taskId);
    const task = this.taskController.tasks.find((t) => t.id === taskId);
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
    if (this.taskController.validate(updatedTask)) {
      Object.assign(task, updatedTask);
      this.taskController.saveTasksToLocalStorage();
      this.taskController.renderAllTasks(this.taskController.tasks);
      this.modalView.closeEditTaskOverlay();
      showNotification('Task successfully edited!', 'success');
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
    this.taskController.tasks = this.taskController.tasks.filter(
      (t) => t.id !== this.pendingTaskToDelete,
    );
    showNotification('Task successfully deleted!', 'success');
    this.taskController.renderAllTasks(this.taskController.tasks);
    this.taskController.saveTasksToLocalStorage();
    this.closeDeleteConfirmationPopup();

    if (this.deleteOrigin === 'all-task-modal') {
      const allTaskPopup = document.getElementById('all-task-modal');
      allTaskPopup.classList.remove('hidden');
    }
  }
}
