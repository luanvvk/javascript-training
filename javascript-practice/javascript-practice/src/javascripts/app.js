import TaskController from './controllers/app-controller-splitted-version.js';
import TaskModel from './models/task-model.js';
import TaskView from './views/app-view.js';

document.addEventListener('DOMContentLoaded', () => new TaskController());
document.addEventListener('DOMContentLoaded', () => new TaskView());
document.addEventListener('DOMContentLoaded', () => new TaskModel());
