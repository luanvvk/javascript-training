//Declaration
const allTaskModal = document.getElementById('all-task-modal');
const menuToggle = document.querySelector('.topbar__menu-toggle');
const sideNavbar = document.querySelector('.app__sidebar');
const mainBody = document.querySelector('.app-main');
const appLogoHeading = document.querySelector('.app__logo-text');
const boardMainView = document.querySelector('.board > .board-view');
const listMainView = document.querySelector('.board > .list-view');
const boardPopupView = document.querySelector('#all-task-modal .board-view.task-columns');
const listPopupView = document.querySelector('#all-task-modal .list-view.task-columns');
export default class NavigationController {
  constructor(taskController) {
    this.taskController = taskController;

    this.setupNavigationListeners();
    this.setupSidebarToggleListener();
    this.setupResponsiveDesignListener();
    this.initDOMElements();
  }

  initDOMElements() {}

  setupNavigationListeners() {
    document.querySelector('.app__sidebar').addEventListener('click', (e) => {
      const target = e.target.closest('.app__nav-link');
      if (!target) return;

      if (target.classList.contains('app__nav-link--all-tasks')) {
        this.showAllTasks();
      } else if (e.target.closest('.app__nav-link--dashboard')) {
        this.showDashboard();
      } else if (target.classList.contains('app__nav-link--board-screen')) {
        this.showBoardView();
      } else if (target.classList.contains('app__nav-link--list-screen')) {
        this.showListView();
      }
    });
  }

  showAllTasks() {
    allTaskModal.classList.remove('hidden');
    this.toggleResponsiveView();
  }

  showDashboard() {
    allTaskModal.classList.add('hidden');
    this.toggleResponsiveView();
  }

  showBoardView() {
    if (allTaskModal.classList.contains('hidden')) {
      // Main view
      boardMainView.classList.remove('hidden');
      listMainView.classList.add('hidden');
    } else {
      // All tasks popup view
      boardPopupView.classList.remove('hidden');
      listPopupView.classList.add('hidden');
    }
    this.toggleResponsiveView();
  }
  showListView() {
    if (allTaskModal.classList.contains('hidden')) {
      // Main view
      boardMainView.classList.add('hidden');
      listMainView.classList.remove('hidden');
    } else {
      // All tasks popup view
      boardPopupView.classList.add('hidden');
      listPopupView.classList.remove('hidden');
    }
    this.toggleResponsiveView();
  }

  toggleResponsiveView() {
    if (window.innerWidth < 800) {
      document.querySelector('.app__sidebar').classList.toggle('active');
      document.querySelector('.app-main').classList.toggle('active');
    }
  }
  // Side bar event
  setupSidebarToggleListener() {
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const isActive = sideNavbar.classList.toggle('active');
        mainBody.classList.toggle('active', isActive);
        appLogoHeading.classList.toggle('active', isActive);
      });
    }
  }

  setupResponsiveDesignListener() {
    const initCheck = (event) => {
      const isActive = !event.matches;
      this.sideNavbar.classList.toggle('active', isActive);
      this.mainBody.classList.toggle('active', isActive);
    };

    document.addEventListener('DOMContentLoaded', () => {
      let width = window.matchMedia('(min-width: 800px)');
      initCheck(width);
      width.addEventListener('change', initCheck);
    });
  }
}
