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
  createTaskOverlay.classList.toggle('toggle');
  editTask.classList.toggle('toggle');
};

// radio buttons for view option
const addTaskBtn = document.querySelector('.add-task-btn');
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById('list-view');
const boardView = document.getElementById('board-view');
radioViewOptions.forEach((radioButton) => {
  radioButton.addEventListener('change', (event) => {
    const eventTarget = event.target;
    const viewOption = eventTarget.value;
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

// create task overlay
let activeOverlay = null;
let taskCtn = mainBody.childNodes[3];

const cancelButtons = document.querySelectorAll('.cancel-button');
const createTaskOverlay = document.getElementById('create-task-overlay');
addTaskBtn.addEventListener('click', () => {
  createTaskOverlay.classList.remove('hide');
  activeOverlay = createTaskOverlay;
  addTaskBtn.classList.add('hide');

  document.body.classList.add('overflow-hidden');
});
// close buttons inside overlays
cancelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeOverlay.classList.add('hide');
    taskCtn.classList.remove('hide');
    addTaskBtn.classList.remove('hide');
    activeOverlay = null;
    // reenable scrolling
    document.body.classList.remove('overflow-hidden');
  });
});
//edit task overlay
const editTask = document.getElementById('edit-task-overlay');
const editBtns = document.querySelectorAll('.task-edit');
editBtns.forEach((button) => {
  button.addEventListener('click', () => {
    editTask.classList.remove('hide');
    activeOverlay = editTask;
    // disable scrolling for content behind the overlay
    document.body.classList.add('overflow-hidden');
  });
});
//delete task and prompt a message after deleting
const notification = document.getElementById('notification');
const deleteBtns = document.querySelectorAll('.task-delete');
deleteBtns.forEach((button) => {
  button.addEventListener('click', () => {
    if (activeOverlay !== null) {
      activeOverlay.classList.add('hide');
      activeOverlay = null;
    } else {
      document.body.classList.remove('overflow-hidden');
      // show notification & hide it after a while
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  });
});

// dropdown select input
// const statusDropdownInputs = document.querySelectorAll('.status-dropdown');
// statusDropdownInputs.forEach((input) => {
//   input.addEventListener('click', () => {
//     statusDropdownInputs.classList.toggle('hide');
//   });
// });

//add task

let tasks = [];
const titleInput = document.querySelector('#task-name-input');
const taskStartInput = document.querySelector('#task-start-input');
const taskEndInput = document.querySelector('#task-end-input');
const submitButton = document.querySelector('.add-task-button');

function createTask(titleInput, taskStartInput, taskEndInput) {
  const task = {
    title: titleInput.value,
    taskstart: taskStartInput.value,
    taskend: taskEndInput.value,
  };
  tasks.push(task);
}

function showTask() {
  const taskCard = document.querySelector('.task-item');
  taskCard.innerHTML = '';
  tasks.forEach((task) => {
    const data = `<li class="task-item">
                  <div class="task-item__details">
                    <h3 class="task-item__heading">Task: ${task.title}</h3>
                    <h4 class="start-date">Start date: ${task.taskStartInput}</h4>
                    <h4 class="end-date">End date:${task.taskEndInput}</h4>
                    <button class="confirm-button">
                      <img
                        class="button-icon"
                        src="./assests/images/icons/task-icons/mark-as-completed-icon.svg"
                        alt="button-icon"
                        loading="lazy"
                      />
                      <h5 class="confirm-button-desc">Mark as completed</h5>
                    </button>
                  </div>
                  <div class="task-item-actions">
                    <a class="task-edit" href="javascript:void(0)">
                      <img
                        class="task-edit-icon"
                        src="./assests/images/icons/task-icons/task-edit-icon.svg"
                        alt="task-edit-icon"
                      />
                    </a>
                    <a class="task-delete" href="javascript:void(0)">
                      <img
                        class="task-delete-icon"
                        src="./assests/images/icons/task-icons/task-delete-icon.svg"
                        alt="task-delete-icon"
                      />
                    </a>
                  </div>
                </li>`;
    taskCard += data;
  });
}

function addTask(e) {
  e.preventDefault();
  const filteredTitles = tasks.filter((task) => {
    return task.title === titleInput.value;
  });

  if (!filteredTitles.length) {
    createTask(titleInput.value, taskStartInput.value, taskEndInput.value);
    titleInput.value = '';
    taskStartInput.value = '';
    taskEndInput.value = '';
  } else {
    showError('Title must be unique!');
  }
  showTask();
}
submitButton.addEventListener('click ', addTask);
