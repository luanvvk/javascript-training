import VALIDATION_MESSAGES from '../constants/validation-messages.js';
class ValidationUtils {
  validateTask(task) {
    const errors = [];

    // Title validation
    if (!task.title || task.title.trim().length < 3) {
      errors.push(VALIDATION_MESSAGES.TITLE_MESSAGE);
    }

    // validate date
    if (!task.startDate) errors.push(VALIDATION_MESSAGES.START_DATE_MESSAGE);
    if (!task.endDate) errors.push(VALIDATION_MESSAGES.END_DATE_MESSAGE);

    if (task.startDate && task.endDate) {
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);

      if (start > end) {
        errors.push(VALIDATION_MESSAGES.DATE_INPUT_COMPARISON);
      }
    }

    // limit description length
    if (task.description && task.description.length > 500) {
      errors.push(VALIDATION_MESSAGES.DESC_MESSAGE);
    }

    // validate priority
    const validPriorities = ['Not Urgent', 'Urgent Task', 'Important'];
    if (!validPriorities.includes(task.priority)) {
      errors.push(VALIDATION_MESSAGES.PRIORITY_MESSAGE);
    }

    // validate category
    const validCategories = ['Daily Task', 'Weekly Task', 'Monthly Task'];
    if (!validCategories.includes(task.category)) {
      errors.push(VALIDATION_MESSAGES.CATEGORY_MESSAGE);
    }

    return errors;
  }

  validateDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
export default ValidationUtils;
