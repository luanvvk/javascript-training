import { formatDate } from '../helpers/format-date-utils.js';
import { calculateTaskDuration } from '../helpers/format-date-utils.js';
// Create task HTML element
export function createTaskElement(task) {
  let buttonIconSrc;
  let buttonText;
  if (task.status === 'To Do') {
    buttonIconSrc = './assets/images/icons/task-icons/todo-task-icon.svg';
    buttonText = 'Mark as In Progress';
  } else if (task.status === 'In Progress') {
    buttonIconSrc = './assets/images/icons/task-icons/running-task-icon.png';
    buttonText = 'Mark as Completed';
  } else if (task.status === 'Completed') {
    buttonIconSrc = './assets/images/icons/task-icons/completed-task-icon.svg';
    buttonText = 'Mark as In Progress';
  }
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = `
    <div class="task-item" data-task-id="${task.id}">
    <div class="task-item__details">
      <h3 class="task-item__heading">${task.title}</h3>
      <h4 class="start-date">Start date: ${formatDate(task.startDate)}</h4>
      <h4 class="end-date">End date: ${formatDate(task.endDate)}</h4>
      <div class="task-duration">
        <span class="duration-badge">Duration: ${calculateTaskDuration(task.startDate, task.endDate)}</span>
      </div>
      <button class="status-button">
        <img class="button-icon" src="${buttonIconSrc}" alt="button-icon" loading="lazy" />
        <span class="confirm-button-desc">${buttonText}</span>
      </button>
    </div>
    <div class="task-item-actions">
      <a class="task-edit" href="javascript:void(0)">
        <img class="task-edit-icon" src="./assets/images/icons/task-icons/task-edit-icon.svg" alt="task-edit-icon" />
      </a>
      <a class="task-delete" href="javascript:void(0)">
        <img class="task-delete-icon" src="./assets/images/icons/task-icons/task-delete-icon.svg" alt="task-delete-icon" />
      </a>
    </div>`;
  return tempDiv.firstElementChild;
}
