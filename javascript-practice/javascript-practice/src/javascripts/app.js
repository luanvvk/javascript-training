import SearchController from './controllers/search-controller.js';
import TaskModel from './models/task-model.js';
import TaskModalView from './views/task-modal-view.js';
import TaskRenderView from './views/task-render-view.js';
import TaskController from './controllers/app-controller-new.js';
import PopupController from './controllers/popup-controller.js';
import FilterController from './controllers/filter-controller.js';
import NavigationController from './controllers/navigation-controller.js';

// document.addEventListener('DOMContentLoaded', () => new TaskBaseView());
document.addEventListener('DOMContentLoaded', () => {
  const taskController = new TaskController();
  // Initialize views
  new TaskRenderView();
  new TaskModalView();
  new TaskModel();

  // Initialize other controllers with taskController reference
  const popupController = new PopupController(taskController);
  const filterController = new FilterController(taskController);
  const searchController = new SearchController(taskController);
  const navigationController = new NavigationController(taskController);
});
