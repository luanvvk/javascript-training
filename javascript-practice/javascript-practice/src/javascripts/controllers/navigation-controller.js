import TaskBaseController from './task-base-controller.js';

export default class NavigationController extends TaskBaseController {
  constructor(model, modalView, renderView) {
    super(model, modalView, renderView);
    this.setupNavigationListeners();
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
      }
    });
  }

  showAllTasks() {
    document.getElementById('all-task-modal').classList.remove('hidden');
    this.toggleResponsiveView();
  }

  showDashboard() {
    document.getElementById('all-task-modal').classList.add('hidden');
    this.toggleResponsiveView();
  }

  showBoardView() {
    document.querySelector('.board-view').classList.remove('hidden');
    document.querySelector('.list-view').classList.add('hidden');
    this.toggleResponsiveView();
  }

  showListView() {
    document.querySelector('.list-view').classList.remove('hidden');
    document.querySelector('.board-view').classList.add('hidden');
    this.toggleResponsiveView();
  }

  toggleResponsiveView() {
    if (window.innerWidth < 800) {
      document.querySelector('.app__sidebar').classList.toggle('active');
      document.querySelector('.app-main').classList.toggle('active');
    }
  }
}
