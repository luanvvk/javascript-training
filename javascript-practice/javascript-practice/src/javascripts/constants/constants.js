export const VALIDATION_MESSAGES = {
  TITLE_MESSAGE: 'Task title must be at least 3 characters long',
  START_DATE_MESSAGE: 'Start date is required',
  END_DATE_MESSAGE: 'End date is required',
  CURRENT_DATE_COMPARISON_START: 'Start date cannot be in the past',
  CURRENT_DATE_COMPARISON_END: 'End date cannot be in the past',
  DATE_INPUT_COMPARISON: 'Start date must be before end date',
  PRIORITY_MESSAGE: 'Invalid priority selected',
  CATEGORY_MESSAGE: 'Invalid category selected',
  DESC_MESSAGE: 'Description must be less than 500 characters',
};

export const FILTER_OPTIONS = {
  category: ['All', 'Daily Task', 'Weekly Task', 'Monthly Task'],
  priority: ['All', 'Not Urgent', 'Urgent Task', 'Important'],
  status: ['All', 'To Do', 'In Progress', 'Completed'],
};

export const VALID_SORT_FIELD = ['name', 'startDate', 'endDate', 'category', 'priority'];

export const PRIORITY_SORT_VALUE = {
  'Not urgent': 1,
  'Urgent Task': 2,
  Important: 3,
};

export const SEARCH_TASK_FIELD = ['title', 'description', 'category', 'priority'];

export const PRIORITY_DROPDOWN_OPTIONS = [
  { value: 'Not Urgent', default: true },
  { value: 'Urgent Task', default: false },
  { value: 'Important', default: false },
];

export const CATEGORY_DROPDOWN_OPTIONS = [
  { value: 'Daily Task', default: true },
  { value: 'Weekly Task', default: false },
  { value: 'Monthly Task', default: false },
];

export const SORT_DROPDOWN_OPTIONS = [
  { value: 'name', label: 'By name' },
  { value: 'startDate', label: 'By start date' },
  { value: 'endDate', label: 'By end date' },
  { value: 'priority', label: 'By priority' },
  { value: 'category', label: 'By category' },
];

export const FILTER_FIELD_DROPDOWN_OPTIONS = [
  { value: 'category', label: 'Category' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

export const STORAGE_KEY = 'tasks';

export const getFormData = () => ({
  title: document.querySelector('.task-name-input')?.value.trim() || '',
  startDate: document.querySelector('#task-start-input')?.value || '',
  endDate: document.querySelector('#task-end-input')?.value || '',
  priority:
    document.querySelector('.form__priority-select .default-option')?.textContent.trim() || '',
  category:
    document.querySelector('.form__category-select .default-option')?.textContent.trim() || '',
  description: document.querySelector('.textarea-input')?.value.trim() || '',
});

export const getUpdatedTaskData = (task) => ({
  ...task,
  title: document.querySelector('#task-title')?.value.trim() || '',
  startDate: document.querySelector('#start-date')?.value || '',
  endDate: document.querySelector('#end-date')?.value || '',
  description: document.querySelector('#textarea')?.value.trim() || '',
  priority:
    document
      .querySelector('#edit-task-modal .form__priority-select .default-option')
      ?.textContent.trim() || '',
  category:
    document
      .querySelector('#edit-task-modal .form__category-select .default-option')
      ?.textContent.trim() || '',
  status:
    document
      .querySelector('#edit-task-modal .form__status-select .default-option')
      ?.textContent.trim() || '',
});
