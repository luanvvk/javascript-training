export function setupEventListeners() {
  // Add Task Buttons
  const addTaskBtns = document.querySelectorAll('.add-a-task');
  addTaskBtns.forEach((btn) => {
    btn.addEventListener('click', () => this.view.openCreateTaskOverlay());
  });

  // Add to List Button
  const addToListButton = document.querySelector('.button-controls .add-to-list');
  if (addToListButton) {
    addToListButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.addTask();
    });
  }

  // Cancel Buttons
  const cancelButtons = document.querySelectorAll('.button-controls .cancel');
  cancelButtons.forEach((btn) => {
    btn.addEventListener('click', () => this.view.closeCreateTaskOverlay());
  });

  const cancelEditButtons = document.querySelectorAll('.edit-controls .cancel');
  cancelEditButtons.forEach((btn) => {
    btn.addEventListener('click', () => this.view.closeEditTaskOverlay());
  });

  //search
  const searchInput = document.querySelector('.input-bar__main-input');
  if (searchInput) {
    searchInput.addEventListener('input', this.searchTasks.bind(this));
  }
  //open/close all task popup
  const dashboardBtn = document.querySelector('.dashboard');
  const allTaskPopup = document.getElementById('all-task-popup');
  const allTaskBtn = document.querySelector('.completed-tasks');
  allTaskBtn.addEventListener('click', () => {
    allTaskPopup.classList.remove('hide');
  });
  dashboardBtn.addEventListener('click', () => {
    allTaskPopup.classList.add('hide');
  });

  // Toggle between views
  const viewOptions = document.querySelectorAll("input[name='view-option']");
  const listView = document.getElementById('list-view');
  const boardView = document.getElementById('board-view');

  viewOptions.forEach((option) => {
    option.addEventListener('change', (e) => {
      if (e.target.value === 'board') {
        if (listView) listView.classList.add('hide');
        if (boardView) boardView.classList.remove('hide');
      } else {
        if (boardView) boardView.classList.add('hide');
        if (listView) listView.classList.remove('hide');
      }
    });
  });

  // Sidebar toggle
  const toggle = document.querySelector('.menu-bar-toggle');
  const sideNavbar = document.querySelector('.side-navbar');
  const mainBody = document.querySelector('.main-body');
  const appLogo = document.querySelector('.app-logo');

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (sideNavbar) sideNavbar.classList.toggle('active');
      if (mainBody) mainBody.classList.toggle('active');
      if (appLogo) appLogo.classList.toggle('active');

      const editTask = document.getElementById('edit-task-overlay');
      if (editTask) editTask.classList.toggle('toggle');
      const createTask = document.getElementById('create-task-overlay');
      if (createTask) createTask.classList.toggle('toggle');
    });
  }
}
