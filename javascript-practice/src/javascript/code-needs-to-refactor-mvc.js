class Task {
  constructor(title, startDate, endDate, priority = 'Not urgent', category = 'Daily Task') {
    this.id = Date.now(); //unique value
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.priority = priority;
    this.category = category;
    this.status = 'To Do'; // Default status
  }
}

// Task Management Class
class TaskManager {
  constructor() {
    this.tasks = [];
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Add Task Overlay
    const addTaskBtn = document.querySelectorAll('.add-a-task');
    const createTaskOverlay = document.getElementById('create-task-overlay');
    addTaskBtn.forEach((button) => {
      button.addEventListener('click', () => {
        createTaskOverlay.classList.remove('hide');
        document.body.classList.add('overflow-hidden');
      });
    });

    // Submit Task
    const submitButton = document.querySelector('.button-controls .add-to-list');
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.addTask();
    });

    // Cancel Button
    const cancelButton = document.querySelector('.button-controls .cancel');
    cancelButton.addEventListener('click', () => {
      createTaskOverlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    });

    // Edit Task Listeners
    this.setupEditTaskListeners();

    // Delete Task Listeners
    this.setupDeleteTaskListeners();

    // Mark as Completed Listeners
    this.setupCompletedTaskListeners();
  }

  addTask() {
    // Collect input values
    const titleInput = document.querySelector('#task-name-input');
    const startDateInput = document.querySelector('#task-start-input');
    const endDateInput = document.querySelector('#task-end-input');
    const prioritySelect = document.querySelector('#priority-select .default-option');
    const categorySelect = document.querySelector('#category-select .default-option');

    // Validate inputs
    if (!titleInput.value || !startDateInput.value || !endDateInput.value) {
      this.showError('Please fill in all required fields');
      return;
    }

    // Create new task
    const newTask = new Task(
      titleInput.value,
      startDateInput.value,
      endDateInput.value,
      prioritySelect.textContent,
      categorySelect.textContent,
    );

    // Add task to tasks array
    this.tasks.push(newTask);

    // Render tasks
    this.renderTasks();

    // Close overlay and reset form
    const createTaskOverlay = document.getElementById('create-task-overlay');
    createTaskOverlay.classList.add('hide');
    document.body.classList.remove('overflow-hidden');

    // Reset form
    titleInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
  }

  renderTasks() {
    // Clear existing tasks in list and board views
    const listViewColumns = {
      toDo: document.querySelector('#list-view .task-column.pink'),
      running: document.querySelector('#list-view .task-column.blue'),
      completed: document.querySelector('#list-view .task-column.green'),
    };

    const boardViewColumns = {
      toDo: document.querySelector('#board-view #todo'),
      running: document.querySelector('#board-view #doing'),
      completed: document.querySelector('#board-view #done'),
    };

    // Reset columns
    Object.values(listViewColumns).forEach((column) => {
      column.innerHTML = column.querySelector('h2').outerHTML;
    });

    Object.values(boardViewColumns).forEach((column) => {
      column.innerHTML = column.querySelector('h2').outerHTML;
    });

    // Render tasks in appropriate columns
    this.tasks.forEach((task) => {
      const taskHTML = this.createTaskElement(task);

      switch (task.status) {
        case 'To Do':
          listViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          boardViewColumns.toDo.appendChild(taskHTML.cloneNode(true));
          break;
        case 'In Progress':
          listViewColumns.running.appendChild(taskHTML.cloneNode(true));
          boardViewColumns.running.appendChild(taskHTML.cloneNode(true));
          break;
        case 'Completed':
          listViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          boardViewColumns.completed.appendChild(taskHTML.cloneNode(true));
          break;
      }
    });

    // Re-attach event listeners
    this.setupEditTaskListeners();
    this.setupDeleteTaskListeners();
    this.setupCompletedTaskListeners();
  }

  createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
      <div class="task-item__details">
        <h3 class="task-item__heading">${task.title}</h3>
        <h4 class="start-date">Start date: ${task.startDate}</h4>
        <h4 class="end-date">End date: ${task.endDate}</h4>
        <button class="confirm-button">
          <img class="button-icon" src="./assests/images/icons/task-icons/mark-as-completed-icon.svg" alt="button-icon" loading="lazy" />
          <h5 class="confirm-button-desc">Mark as completed</h5>
        </button>
      </div>
      <div class="task-item-actions">
        <a class="task-edit" href="javascript:void(0)">
          <img class="task-edit-icon" src="./assests/images/icons/task-icons/task-edit-icon.svg" alt="task-edit-icon" />
        </a>
        <a class="task-delete" href="javascript:void(0)">
          <img class="task-delete-icon" src="./assests/images/icons/task-icons/task-delete-icon.svg" alt="task-delete-icon" />
        </a>
      </div>
    `;

    return taskElement;
  }

  setupEditTaskListeners() {
    const editBtns = document.querySelectorAll('.task-edit');
    const editOverlay = document.getElementById('edit-task-overlay');

    editBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const taskElement = button.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.taskId);
        const task = this.tasks.find((t) => t.id === taskId);

        if (task) {
          // Populate edit overlay with task details
          const titleInput = editOverlay.querySelector('#task-title');
          const startDateInput = editOverlay.querySelector('#start-date');
          const endDateInput = editOverlay.querySelector('#end-date');

          titleInput.value = task.title;
          startDateInput.value = task.startDate;
          endDateInput.value = task.endDate;

          // Show edit overlay
          editOverlay.classList.remove('hide');
          document.body.classList.add('overflow-hidden');

          // Setup confirm edit button
          const confirmEditBtn = editOverlay.querySelector('.edit-controls .edit-task-button');
          confirmEditBtn.onclick = () => this.updateTask(taskId);
        }
      });
    });

    // Cancel edit button
    const cancelEditBtn = document.querySelector('.edit-controls .cancel');
    cancelEditBtn.addEventListener('click', () => {
      editOverlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    });
  }

  updateTask(taskId) {
    const editOverlay = document.getElementById('edit-task-overlay');
    const titleInput = editOverlay.querySelector('#task-title');
    const startDateInput = editOverlay.querySelector('#start-date');
    const endDateInput = editOverlay.querySelector('#end-date');

    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].title = titleInput.value;
      this.tasks[taskIndex].startDate = startDateInput.value;
      this.tasks[taskIndex].endDate = endDateInput.value;

      this.renderTasks();
      editOverlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    }
  }

  setupDeleteTaskListeners() {
    const deleteBtns = document.querySelectorAll('.task-delete');
    const notification = document.getElementById('notification');

    deleteBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const taskElement = button.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.taskId);

        // Remove task from tasks array
        this.tasks = this.tasks.filter((t) => t.id !== taskId);

        // Re-render tasks
        this.renderTasks();

        // Show notification
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3000);
      });
    });
  }

  setupCompletedTaskListeners() {
    const completedBtns = document.querySelectorAll('.confirm-button');

    completedBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const taskElement = button.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.taskId);

        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          // Update task status
          this.tasks[taskIndex].status =
            this.tasks[taskIndex].status === 'Completed' ? 'In Progress' : 'Completed';

          this.renderTasks();
        }
      });
    });
  }

  showError(message) {
    // Create error notification
    const errorNotification = document.createElement('div');
    errorNotification.classList.add('error-notification');
    errorNotification.textContent = message;
    document.body.appendChild(errorNotification);

    // Remove after 3 seconds
    setTimeout(() => {
      errorNotification.remove();
    }, 3000);
  }
}

// Initialize Task Manager
document.addEventListener('DOMContentLoaded', () => {
  const taskManager = new TaskManager();
});

// View Toggle Functionality
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById('list-view');
const boardView = document.getElementById('board-view');

radioViewOptions.forEach((radioButton) => {
  radioButton.addEventListener('change', (event) => {
    const viewOption = event.target.value;
    switch (viewOption) {
      case 'board':
        listView.classList.add('hide');
        boardView.classList.remove('hide');
        break;
      case 'list':
        boardView.classList.add('hide');
        listView.classList.remove('hide');
        break;
    }
  });
});

let list = document.querySelectorAll('.navbar--list__item');
function activeLink() {
  list.forEach((item) => {
    item.classList.remove('hovered');
  });
  this.classList.add('hovered');
}

list.forEach((item) => item.addEventListener('onmouseenter', activeLink));
// Menu Toggle
let toggle = document.querySelector('.menu-bar-toggle');
let sideNavbar = document.querySelector('.side-navbar');
let mainBody = document.querySelector('.main-body');
let appLogo = document.querySelector('.app-logo');

toggle.onclick = function () {
  sideNavbar.classList.toggle('active');
  mainBody.classList.toggle('active');
  appLogo.classList.toggle('active');
  const editTask = document.getElementById('edit-task-overlay');
  editTask.classList.toggle('toggle');
};
