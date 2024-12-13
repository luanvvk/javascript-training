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

  // Validate task data
  validate() {
    const errors = [];
    if (!this.title) errors.push('Task title cannot be empty');
    if (!this.startDate) errors.push('Start date is required');
    if (!this.endDate) errors.push('End date is required');

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      errors.push('Start date cannot be later than end date');
    }
    if (this.description && this.description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }
    return errors;
  }
}
export default TaskModel;
