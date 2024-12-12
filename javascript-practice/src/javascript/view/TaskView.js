class TaskView {
  constructor() {
    this.listViewColumns = {
      toDo: document.querySelector('#list-view .task-column.pink .task-list'),
      running: document.querySelector('#list-view .task-column.blue .task-list'),
      completed: document.querySelector('#list-view .task-column.green .task-list'),
    };

    this.boardViewColumns = {
      toDo: document.querySelector('#board-view #todo .task-list'),
      running: document.querySelector('#board-view #doing .task-list'),
      completed: document.querySelector('#board-view #done .task-list'),
    };

    this.createTaskOverlay = document.getElementById('create-task-overlay');
    this.editTaskOverlay = document.getElementById('edit-task-overlay');
    this.notification = document.getElementById('notification');
  }

  // Create task HTML element
  createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');
    taskElement.dataset.taskId = task.id;

    const isCompleted = task.status === 'Completed';
    const buttonIconSrc = isCompleted
      ? './assets/images/icons/task-icons/completed-icon.svg'
      : './assets/images/icons/task-icons/mark-as-completed-icon.svg';
    const buttonText = isCompleted ? 'Mark as In Progress' : 'Mark as Completed';

    taskElement.innerHTML = `
      <div class="task-item__details">
        <h3 class="task-item__heading">${task.title}</h3>
        <h4 class="start-date">Start date: ${this.formatDate(task.startDate)}</h4>
        <h4 class="end-date">End date: ${this.formatDate(task.endDate)}</h4>
        <div class="task-duration">
          <span class="duration-badge">Duration: ${this.calculateTaskDuration(task.startDate, task.endDate)}</span>
        </div>
        <button class="mark-completed">
          <img class="button-icon" src="${buttonIconSrc}" alt="button-icon" loading="lazy" />
          <span class="confirm-button-desc">${buttonText}</span>
        </button>
      </div>
      <div class="task-item-actions">
        <a class="task-edit" href="javascript:void(0)">
          <img class="task-edit-icon" src="./assets/images/icons/task-icons/task-edit-icon.svg" alt="task-edit-icon" />
        </a>
        <a class="task-delete" href="javascript:void(0)">
          <img class="task-delete-icon" src="./assets/images/icons/task-icons/task-delete-icon.svg" alt="task-delete-icon" />
        </a>
      </div>`;
    return taskElement;
  }

  // Render tasks in both views
  renderTasks(tasks) {
    // Clear previous tasks
    Object.values(this.listViewColumns).forEach((column) => (column.innerHTML = ''));
    Object.values(this.boardViewColumns).forEach((column) => (column.innerHTML = ''));

    // Render tasks in appropriate columns
    tasks.forEach((task) => {
      const taskHTML = this.createTaskElement(task);

      switch (task.status) {
        case 'To Do':
          this.listViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          this.boardViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          break;
        case 'In Progress':
          this.listViewColumns.running.appendChild(taskHTML.cloneNode(true));
          this.boardViewColumns.running.appendChild(taskHTML.cloneNode(true));
          break;
        case 'Completed':
          this.listViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          this.boardViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          break;
      }
    });
  }
  //render all task popup
  renderAllTasksPopup(tasks) {
    const popupTaskList = document.querySelector('.all-task-popup .task-list');
    if (!popupTaskList) return;
    //clear previous tasks
    popupTaskList.innerHTML = '';
    //add filter task
    tasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      popupTaskList.appendChild(taskElement);
    });
    //show message in case no matched results
    if (tasks.length === 0) {
      popupTaskList.innerHTML = `<p class="no-tasks">No tasks match the criteria</p>`;
    }
  }

  // Utility methods
  formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  calculateTaskDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 0 ? 'Same day' : `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }

  // Show error notification
  showError(message) {
    this.removeExistingErrors();
    const errorNotification = document.createElement('div');
    errorNotification.classList.add('error-notification');
    // Create error notification element
    errorNotification.innerHTML = `
       <div class="error-content">
         <img src="./assets/images/icons/error-icon/error-icon.svg" alt="Error Icon" class="error-icon">
         <span class="error-message">${message}</span>
       </div>
     `;
    const mainBody = document.querySelector('.main-body');
    const topBar = document.querySelector('.top-bar');
    const insertLocation = topBar || mainBody;
    if (insertLocation) {
      insertLocation.insertAdjacentElement('afterend', errorNotification);
    }

    setTimeout(() => {
      errorNotification.classList.add('show');
    }, 10);

    // Remove error after 3 seconds
    setTimeout(() => {
      this.removeExistingErrors();
    }, 3000);
  }
  removeExistingErrors() {
    const existingErrors = document.querySelectorAll('.error-notification');
    existingErrors.forEach((error) => {
      error.classList.remove('show');
      error.remove();
    });
  }

  // Open/close overlays
  openCreateTaskOverlay() {
    this.createTaskOverlay.classList.remove('hide');
    document.body.classList.add('overflow-hidden');
  }

  closeCreateTaskOverlay() {
    this.createTaskOverlay.classList.add('hide');
    document.body.classList.remove('overflow-hidden');
  }

  openEditTaskOverlay() {
    this.editTaskOverlay.classList.remove('hide');
    document.body.classList.add('overflow-hidden');
  }

  closeEditTaskOverlay() {
    this.editTaskOverlay.classList.add('hide');
    document.body.classList.remove('overflow-hidden');
  }

  // Populate edit form
  populateEditForm(task) {
    document.querySelector('#task-title').value = task.title;
    document.querySelector('#start-date').value = task.startDate;
    document.querySelector('#end-date').value = task.endDate;
    document.querySelector('#textarea').value = task.description;

    // target priority dropdown value
    const priorityContainer = document.querySelector(
      '#edit-task-overlay .priority-select .default-option-container .default-option',
    );
    priorityContainer.textContent = task.priority;

    // Target category dropdown value
    const categoryContainer = document.querySelector(
      '#edit-task-overlay .category-select .default-option-container .default-option',
    );
    categoryContainer.textContent = task.category;
  }

  // Reset create task form
  resetCreateTaskForm() {
    document.querySelector('.task-name-input').value = '';
    document.querySelector('.task-start-input').value = '';
    document.querySelector('.task-end-input').value = '';
    document.querySelector('.textarea-input').value = '';
  }

  // Show task deletion notification
  showDeletionNotification() {
    this.notification.classList.add('show');
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }
}
export default TaskView;
