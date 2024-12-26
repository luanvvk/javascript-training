import TaskBaseController from './controllers/task-base-controller.js';
import FilterController from './controllers/filter-controller.js';
import NavigationController from './controllers/filter-controller.js';
import MainTaskController from './controllers/main-task-controller.js';
import SearchController from './controllers/search-controller.js';
import TaskActionController from './controllers/task-form-controller.js';
import TaskModel from './models/task-model.js';
import TaskBaseView from './views/task-base-view.js';
import TaskModalView from './views/task-modal-view.js';
import TaskRenderView from './views/task-render-view.js';

document.addEventListener('DOMContentLoaded', () => new TaskBaseController());
document.addEventListener('DOMContentLoaded', () => new MainTaskController());

document.addEventListener('DOMContentLoaded', () => new FilterController());
document.addEventListener('DOMContentLoaded', () => new NavigationController());
document.addEventListener('DOMContentLoaded', () => new SearchController());
document.addEventListener('DOMContentLoaded', () => new TaskActionController());
document.addEventListener('DOMContentLoaded', () => new TaskBaseView());
document.addEventListener('DOMContentLoaded', () => new TaskRenderView());
document.addEventListener('DOMContentLoaded', () => new TaskModalView());
document.addEventListener('DOMContentLoaded', () => new TaskModel());
