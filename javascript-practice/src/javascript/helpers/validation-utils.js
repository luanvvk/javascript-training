class ValidationUtils {
  validateTask(task) {
    const errors = [];

    // Title validation
    if (!task.title || task.title.trim().length < 3) {
      errors.push('Task title must be at least 3 characters long');
    }

    // validate date
    if (!task.startDate) errors.push('Start date is required');
    if (!task.endDate) errors.push('End date is required');

    if (task.startDate && task.endDate) {
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);

      if (start > end) {
        errors.push('Start date must be before end date');
      }
    }

    // limit description length
    if (task.description && task.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    // validate priority
    const validPriorities = ['Not Urgent', 'Urgent Task', 'Important'];
    if (!validPriorities.includes(task.priority)) {
      errors.push('Invalid priority selected');
    }

    // validate category
    const validCategories = ['Daily Task', 'Weekly Task', 'Monthly Task'];
    if (!validCategories.includes(task.category)) {
      errors.push('Invalid category selected');
    }

    return errors;
  }

  validateDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
export default ValidationUtils;
