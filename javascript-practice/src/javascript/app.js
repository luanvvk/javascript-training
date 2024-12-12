import TaskController from './controllers/TaskController.js';
import TaskModel from './models/TaskModel.js';
import TaskView from './view/TaskView.js';

document.addEventListener('DOMContentLoaded', () => new TaskController());
document.addEventListener('DOMContentLoaded', () => new TaskView());
document.addEventListener('DOMContentLoaded', () => new TaskModel());
