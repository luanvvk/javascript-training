// Show task deletion notification
export function showDeletionNotification() {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Show a "no tasks" message if columns are empty
export function showNoTasksMessage(columns, viewType) {
  Object.keys(columns).forEach((key) => {
    if (!columns[key].children.length) {
      const message = document.createElement('p');
      message.classList.add('no-tasks-message');
      message.textContent = `No tasks in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} (${viewType})`;
      columns[key].appendChild(message);
    }
  });
}
