/** This file is use to control the navigation of the app
 * Uses event delegation to handle event listeners
 */

//Declaration

export default class NavigationController {
  constructor(taskController) {
    // Store reference to task controller
    this.taskController = taskController;
    this.initDOMElements();
    this.setupNavigationListeners();
    this.setupSidebarToggleListener();
    this.setupResponsiveDesignListener();
  }
  initDOMElements() {
    this.allTaskModal = document.getElementById('all-task-modal');
    this.menuToggle = document.querySelector('.topbar__menu-toggle');
    this.sideNavbar = document.querySelector('.app__sidebar');
    this.mainBody = document.querySelector('.app-main');
    this.appLogoHeading = document.querySelector('.app__logo-text');
    this.closeButton = document.querySelector('.sidebar__close-btn');
    this.boardMainView = document.querySelector('.board > .board-view');
    this.listMainView = document.querySelector('.board > .list-view');
    this.boardPopupView = document.querySelector('#all-task-modal .board-view.task-columns');
    this.listPopupView = document.querySelector('#all-task-modal .list-view.task-columns');
  }

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
      } else if (
        target.matches('.app__nav-link--notification, .app__nav-link--theme, .app__nav-link--login')
      ) {
        this.closeSideBar();
      }
    });
  }

  showAllTasks() {
    this.toggleModalVisibility(false);
  }

  showDashboard() {
    this.toggleModalVisibility(true);
  }

  showBoardView() {
    this.toggleView(this.boardMainView, this.listMainView, this.boardPopupView, this.listPopupView);
  }

  showListView() {
    this.toggleView(this.listMainView, this.boardMainView, this.listPopupView, this.boardPopupView);
  }

  toggleModalVisibility(isDashboard) {
    if (this.allTaskModal) {
      this.allTaskModal.classList.toggle('hidden', isDashboard);
    }
    this.toggleResponsiveView();
  }

  toggleView(mainViewToShow, mainViewToHide, popupViewToShow, popupViewToHide) {
    const isMainView = this.allTaskModal && this.allTaskModal.classList.contains('hidden');
    if (isMainView) {
      mainViewToShow.classList.remove('hidden');
      mainViewToHide.classList.add('hidden');
    } else {
      popupViewToShow.classList.remove('hidden');
      popupViewToHide.classList.add('hidden');
    }
    this.toggleResponsiveView();
  }

  toggleClass(elements, className, isActive) {
    elements.forEach((element) => {
      element.classList.toggle(className, isActive);
    });
  }

  // Side bar event
  setupSidebarToggleListener() {
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => {
        const isActive = this.sideNavbar && this.sideNavbar.classList.toggle('active');
        this.toggleClass([this.mainBody, this.appLogoHeading], 'active', isActive);
      });
    }
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.closeSideBar();
      });
    }
  }

  closeSideBar() {
    this.toggleClass([this.sideNavbar, this.mainBody, this.appLogoHeading], 'active', false);
  }

  toggleResponsiveView() {
    if (window.innerWidth < 800) {
      this.closeSideBar();
    }
  }

  setupResponsiveDesignListener() {
    const initCheck = (event) => {
      const isActive = !event.matches;
      this.toggleClass([this.sideNavbar, this.mainBody], 'active', isActive);
    };

    document.addEventListener('DOMContentLoaded', () => {
      let width = window.matchMedia('(min-width: 800px)');
      initCheck(width);
      width.addEventListener('change', initCheck);
    });
  }
}
