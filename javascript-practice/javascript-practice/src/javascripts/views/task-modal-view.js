import { createFormElements } from '../templates/templates';
import TaskBaseView from './task-base-view.js';

class TaskModalView extends TaskBaseView {
  constructor() {
    super();
    this.createTaskOverlay = document.getElementById('create-task-modal');
    this.editTaskOverlay = document.getElementById('edit-task-modal');
  }

  // Open/close overlays
  openCreateTaskOverlay() {
    createFormElements('create');
    this.createTaskOverlay.classList.toggle('hidden');
    document.body.classList.add('overflow-hidden');
  }

  closeCreateTaskOverlay() {
    this.createTaskOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  openEditTaskOverlay() {
    createFormElements('edit');
    this.editTaskOverlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  closeEditTaskOverlay() {
    const allTaskPopup = document.getElementById('all-task-modal');
    if (!allTaskPopup.classList.contains('hidden')) {
      this.editTaskOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    } else {
      this.editTaskOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Populate edit form
  populateEditForm(task) {
    document.querySelector('#task-title').value = task.title;
    document.querySelector('#start-date').value = task.startDate;
    document.querySelector('#end-date').value = task.endDate;
    document.querySelector('#textarea').value = task.description;

    // target priority dropdown value
    const priorityContainer = document.querySelector(
      '#edit-task-modal .form__priority-select .default-option-container .default-option',
    );
    priorityContainer.textContent = task.priority || 'Not Urgent';

    // Target category dropdown value
    const categoryContainer = document.querySelector(
      '#edit-task-modal .form__category-select .default-option-container .default-option',
    );
    categoryContainer.textContent = task.category || 'Daily Task';
  }

  // Reset create task form
  resetCreateTaskForm() {
    const formElements = [
      '.task-name-input',
      '.task-start-input',
      '.task-end-input',
      '.textarea-input',
    ];
    formElements.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) element.value = '';
    });
  }
}
export default TaskModalView;
