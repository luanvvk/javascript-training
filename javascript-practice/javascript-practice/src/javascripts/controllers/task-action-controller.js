class TaskActionController {
  constructor(tasks, view, storageUtil, errorHandler) {
    this.tasks = tasks;
    this.view = view;
    this.storageUtil = storageUtil;
    this.errorHandler = errorHandler;
  }
}
