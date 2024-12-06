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

// create task
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
const statusDropdownInputs = document.querySelectorAll('.status-dropdown');
statusDropdownInputs.forEach((input) => {
  input.addEventListener('click', () => {
    statusDropdownInputs.classList.toggle('hide');
  });
});
