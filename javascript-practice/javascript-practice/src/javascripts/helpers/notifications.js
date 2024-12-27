// Show task deletion notification
export function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type} show`;
  notification.innerHTML = `
          <img
            class="notification__icon"
            src="./assets/images/icons/menu-bar-icons/completed-task-icon.svg"
            alt="notification__icon "
          />
          <p class="notification__message">${message}</p>
          `;

  document.querySelector('.app-main').appendChild(notification);

  setTimeout(() => {
    notification.remove('show');
  }, 3000); // Remove notification after 3 seconds
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
