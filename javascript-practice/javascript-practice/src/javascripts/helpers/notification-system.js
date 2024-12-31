class NotificationSystem {
  constructor() {
    this.timeOutDuration = 3000;
  }

  show(message, config = {}) {
    const { type = 'info', duration: timeOutDuration, icon = this.getDefaultIcon(type) } = config;

    this.removeExistingNotification();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type} show`;
    notification.innerHTML = `
          
          <img
            class="notification__icon"
            src="./assets/images/icons/menu-bar-icons/completed-task-icon.svg"
            alt="notification__icon "
          />
          <span class="notification__message">${message}</span>
          `;
  }
}
