import TaskModalView from '../views/task-modal-view.js';
import TaskRenderView from '../views/task-render-view.js';
import SearchController from './search-controller.js';
import FilterController from './filter-controller.js';
import NavigationController from './navigation-controller.js';
import TaskFormController from './task-form-controller.js';
import TaskModel from '../models/task-model.js';
import TaskBaseController from './task-base-controller.js';
import ErrorHandler from '../helpers/error-handler-utils.js';
import {
  createFormElements,
  setupPopupDropdowns,
  renderSortingUI,
} from '../templates/templates.js';

class MainTaskController {
  constructor() {
    this.model = new TaskModel();
    this.renderView = new TaskRenderView();
    this.modalView = new TaskModalView();
    this.errorHandler = new ErrorHandler();
    this.initialize();
    // Initialize sub-controllers
    this.formController = new TaskFormController(this.model, this.modalView, this.renderView);
    // this.statusController = new TaskStatusController(this.model, this.modalView, this.renderView);
    this.filterController = new FilterController(this.model, this.modalView, this.renderView);
    this.searchController = new SearchController(this.model, this.modalView, this.renderView);
    this.baseController = new TaskBaseController(this.model, this.modalView, this.renderView);
    this.navigationController = new NavigationController(
      this.model,
      this.modalView,
      this.renderView,
    );
  }

  initialize() {
    try {
      this.formController.loadTasksFromLocalStorage();
      this.setupDynamicForm();
      this.renderView.renderAllTasksPopup(this.formController.tasks);
      this.renderView.renderTasks(this.formController.tasks);
    } catch (error) {
      this.errorHandler.log(`Error during initialization: ${error.message}`, 'error');
    }
  }

  setupDynamicForm() {
    try {
      createFormElements();
      setupPopupDropdowns();
      renderSortingUI();
    } catch (error) {
      this.formController.errorHandler.log(
        `Error setting up dynamic form: ${error.message}`,
        'error',
      );
    }
  }
}

export default MainTaskController;
