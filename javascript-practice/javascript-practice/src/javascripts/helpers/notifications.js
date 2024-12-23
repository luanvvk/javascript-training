const notification = document.querySelector('.notification');
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
      const message = document.createElement('li');
      message.classList.add('no-tasks-message');
      message.innerHTML = `<h3>No tasks in ${key.replace(/([A-Z])/g, ' $1').toUpperCase()} column (${viewType})</h3>`;
      columns[key].appendChild(message);
    }
  });
}
