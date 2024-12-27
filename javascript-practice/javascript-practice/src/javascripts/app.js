import TaskModel from './models/task-model.js';
import TaskModalView from './views/task-modal-view.js';
import TaskRenderView from './views/task-render-view.js';
import TaskController from './controllers/app-controller-main.js';

document.addEventListener('DOMContentLoaded', () => {
  new TaskController();
  // Initialize views
  new TaskRenderView();
  new TaskModalView();
  new TaskModel();
});
