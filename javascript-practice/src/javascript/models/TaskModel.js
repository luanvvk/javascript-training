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

  // Convert task to a plain object for storage
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      priority: this.priority,
      description: this.description,
      category: this.category,
      status: this.status,
    };
  }

  // Create a Task instance from a stored object
  static fromJSON(json) {
    const task = new TaskModel(
      json.title,
      json.startDate,
      json.endDate,
      json.description,
      json.priority,
      json.category,
    );
    task.id = json.id;
    task.status = json.status;
    return task;
  }

  // Validate task data
  validate() {
    const errors = [];
    if (!this.title) errors.push('Title is required');
    if (!this.startDate) errors.push('Start date is required');
    if (!this.endDate) errors.push('End date is required');

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      errors.push('Start date must be earlier than or equal to end date');
    }

    return errors;
  }
}
export default TaskModel;
