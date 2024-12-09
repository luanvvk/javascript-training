class Task {
  constructor(title, startDate, endDate, priority = 'Not urgent', category = 'Daily Task') {
    this.id = Date.now(); //unique value
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.priority = priority;
    this.category = category;
    this.status = 'To Do'; // Default status
  }
}
export default Task;
