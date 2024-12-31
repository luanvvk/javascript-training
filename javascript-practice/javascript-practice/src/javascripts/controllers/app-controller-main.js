/**
 * @file app-controller-main.js
 * @description Main controller responsible for connecting
 * all smaller controllers and task views.
 * It handles the loading and saving of tasks from/to localStorage
 * and manages errors if any DOM element is not initialized properly.
 *
 * @module TaskController
 */
import TaskModel from '../models/task-model.js';
import TaskRenderView from '../views/task-render-view.js';
import TaskModalView from '../views/task-modal-view.js';
import ValidationUtils from '../helpers/validation-utils.js';
import LocalStorageUtil from '../helpers/local-storage-utils.js';

import PopupController from './popup-controller.js';
import SearchController from './search-controller.js';
import NavigationController from './navigation-controller.js';
import FilterController from './filter-controller.js';
import TaskBaseView from '../views/task-base-view.js';
import { STORAGE_KEY } from '../constants/constants.js';
import NotificationUtils from '../helpers/notification-utils.js';

class TaskController {
  //create an instance for taskController
  constructor() {
    this.initializeCoreComponents();
    this.initializeControllers();
    this.initialize();
  }

  /**
   * Initializes core components required for the task controller.
   * Sets up the model, views, utilities, and error handler.
   */
  initializeCoreComponents() {
    //Core components
    this.model = new TaskModel();
    this.baseView = new TaskBaseView();
    this.modalView = new TaskModalView();
    this.renderView = new TaskRenderView();
    this.tasks = [];
    // Utilities
    this.localStorageUtil = new LocalStorageUtil(STORAGE_KEY);
    this.validationUtils = new ValidationUtils();
    this.notifications = new NotificationUtils();
  }
  // Initializes smaller controllers used by the task controller.
  initializeControllers() {
    this.popupController = new PopupController(this);
    this.searchController = new SearchController(this);
    this.navigationController = new NavigationController(this);
    this.filterController = new FilterController(this);
  }

  //Performs additional initialization tasks.
  initialize() {
    try {
      this.loadTasksFromLocalStorage();
      this.renderTasks(this.tasks);
    } catch (error) {
      this.notifications.log(`Error during initialization: ${error.message}`, 'error');
    }
  }

  //Load tasks from localStorage
  loadTasksFromLocalStorage() {
    try {
      this.tasks = this.localStorageUtil.load() || [];
    } catch (error) {
      this.notifications.log(`Error loading tasks from local storage: ${error.message}`, 'error');
    }
  }

  //Save tasks from localStorage
  saveTasksToLocalStorage() {
    try {
      this.localStorageUtil.save(this.tasks);
    } catch (error) {
      this.notifications.log(`Error saving tasks to local storage: ${error.message}`, 'error');
    }
  }

  //check if any validation errors
  validate(task) {
    try {
      const validationErrors = this.validationUtils.validateTask(task);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => this.showError(error));
        return false;
      }
      return true;
    } catch (error) {
      this.notifications.log(`Error validating task: ${error.message}`, 'error');
    }
  }

  /**
   * Handles errors by displaying an error message.
   * @param {string} message - The error message to display.
   */
  showError(message) {
    this.notifications.show(message, { type: 'error' });
  }

  //render tasks to views
  renderTasks() {
    this.renderView.renderTasks(this.tasks);
  }
}
export default TaskController;
