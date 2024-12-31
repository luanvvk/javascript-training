class NotificationUtils {
  constructor() {
    this.timeOutDuration = 3000;
  }

  show(message, config = {}) {
    const {
      type = 'info',
      duration = this.timeOutDuration,
      icon = this.getDefaultIcon(type),
    } = config;

    this.removeExistingNotifications();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type} show`;
    notification.innerHTML = `
        <div class="notification-content">
          <img
            class="notification__icon"
            src="${icon}"
            alt="${type} icon "
          />
          <span class="notification__message">${message}</span>
        </div>
          `;

    const insertLocation = this.getInsertLocation();
    if (insertLocation) {
      insertLocation.insertAdjacentElement('afterend', notification);
    } else {
      document.body.appendChild(notification);
    }

    // Log the notification
    this.log(message, type);

    setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hide');
    }, duration);
  }

  log(message, type = 'error') {
    const time = new Date().toISOString();
    const logMessage = `[${time}] ${type.toUpperCase()}: ${message}`;

    // Ensure the type is a valid console method
    const messageType = {
      success: 'log',
      error: 'error',
      warning: 'warn',
      info: 'info',
    };
    const validMessageType = messageType[type] || 'log';

    console[validMessageType](logMessage);
  }

  getDefaultIcon(type) {
    const iconMap = {
      success: './assets/images/icons/menu-bar-icons/completed-task-icon.svg',
      error: './assets/images/icons/error-icon/error-icon.svg',
      warning: './assets/images/icons/warning-icon.svg',
      info: './assets/images/icons/info-icon.svg',
    };

    return iconMap[type] || iconMap.info;
  }

  getInsertLocation() {
    const topBar = document.querySelector('.topbar');
    const mainApp = document.querySelector('.app-main');
    return topBar || mainApp || null;
  }

  removeExistingNotifications() {
    try {
      const existingNotifications = document.querySelectorAll('.notification');
      if (existingNotifications) {
        existingNotifications.forEach((notification) => {
          notification.classList.remove('show');
          notification.classList.add('hide');
          setTimeout(() => notification.remove(), 1000);
        });
      }
    } catch (error) {
      this.log(`Fail to remove existing error: ${error.message}`, 'error');
    }
  }
}

export default NotificationUtils;
