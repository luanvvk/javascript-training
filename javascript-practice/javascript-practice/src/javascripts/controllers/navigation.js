/**
 * @file navigation-controller.js
 * @description This file is used to control the navigation of the app.
 * It uses event delegation to handle event listeners for navigation links,
 * sidebar toggles, and responsive design.
 *
 * @module NavigationController
 */

import { VIEW_TYPE, VIEW_TYPE_KEY } from '../constants/constants.js';
export default class NavigationController {
  /**
   * Create an instance of Navigation Controller
   * @param {object} taskController - task controller instance
   */
  constructor() {
    this.VIEW_TYPE_KEY = VIEW_TYPE_KEY;
    this.VIEW_TYPE = VIEW_TYPE;
    this.initDOMElements();
    this.setupNavigationListeners();
    this.setupSidebarToggleListener();
    this.setupResponsiveDesignListener();
    this.loadSavedViewType();
  }

  // Init DOM elements used by the navigation controller
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

  loadSavedViewType() {
    try {
      const savedViewType = localStorage.getItem(this.VIEW_TYPE_KEY);
      if (savedViewType) {
        if (savedViewType === this.VIEW_TYPE.LIST) {
          this.showListView(false);
        } else if (savedViewType === this.VIEW_TYPE.BOARD) {
          this.showBoardView(false);
        } else if (savedViewType === this.VIEW_TYPE.DASHBOARD) {
          this.showDashboard(false);
        } else if (savedViewType === this.VIEW_TYPE.ALL_TASKS) {
          this.showAllTasks(false);
        }
      }
    } catch (error) {
      console.error('Error loading saved view type:', error);
    }
  }

  savedViewType(viewType) {
    try {
      localStorage.setItem(this.VIEW_TYPE_KEY, viewType);
    } catch (error) {
      console.error('Error saving view type:', error);
    }
  }

  // Setup event listeners for navigation links
  setupNavigationListeners() {
    document.querySelector('.app__sidebar').addEventListener('click', (e) => {
      const target = e.target.closest('.app__nav-link');
      if (!target) return;

      // Handle navigation link click
      this.handleNavigationLinkClick(target);
    });
  }

  /**
   * Handles navigation link clicks.
   * @param {HTMLElement} target - The clicked navigation link element.
   */

  handleNavigationLinkClick(target) {
    if (target.classList.contains('app__nav-link--all-tasks')) {
      this.showAllTasks();
    } else if (target.closest('.app__nav-link--dashboard')) {
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
  }

  showAllTasks(state = true) {
    this.toggleModalVisibility(false);
    if (state) {
      this.savedViewType(this.VIEW_TYPE.ALL_TASKS);
    }
  }

  showDashboard(state = true) {
    this.toggleModalVisibility(true);
    if (state) {
      this.savedViewType(this.VIEW_TYPE.DASHBOARD);
    }
  }

  showBoardView(state = true) {
    this.toggleView(this.boardMainView, this.listMainView, this.boardPopupView, this.listPopupView);
    if (state) {
      this.savedViewType(this.VIEW_TYPE.BOARD);
    }
  }

  showListView(state = true) {
    this.toggleView(this.listMainView, this.boardMainView, this.listPopupView, this.boardPopupView);
    if (state) {
      this.savedViewType(this.VIEW_TYPE.LIST);
    }
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

  // setup event listener for the sidebar toggle button
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

  // setup event listener for responsive design adjustment
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
