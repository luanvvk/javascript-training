import TaskController from './controllers/app-controller.js';
import TaskModel from './models/task-model.js';
import TaskView from './view/app-view.js';

document.addEventListener('DOMContentLoaded', () => new TaskController());
document.addEventListener('DOMContentLoaded', () => new TaskView());
document.addEventListener('DOMContentLoaded', () => new TaskModel());
