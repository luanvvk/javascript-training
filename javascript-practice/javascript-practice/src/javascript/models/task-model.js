class TaskModel {
  constructor(title, startDate, endDate, description, priority, category) {
    this.id = Date.now();
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.priority = priority;
    this.description = description;
    this.category = category;
    this.status = 'To Do';
  }
}
export default TaskModel;
