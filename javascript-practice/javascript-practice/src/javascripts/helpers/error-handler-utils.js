class ErrorHandler {
  log(message, type = 'error') {
    const time = new Date().toISOString();
    const logMessage = `[${time}] ${type.toUpperCase()}: ${message}`;

    // Console logging
    console[type](logMessage);
  }

  showError(message) {
    this.removeExistingErrors();

    const errorNotification = document.createElement('div');
    errorNotification.classList.add('error-notification');
    // Create error notification element
    errorNotification.innerHTML = `
       <div class="error-content">
         <img src="./assets/images/icons/error-icon/error-icon.svg" alt="Error Icon" class="error-icon">
         <span class="error-message">${message}</span>
       </div>
     `;
    const mainBody = document.querySelector('.app-main');
    const topBar = document.querySelector('.topbar');
    const insertLocation = topBar || mainBody;
    if (insertLocation) {
      insertLocation.insertAdjacentElement('afterend', errorNotification);
    }

    setTimeout(() => {
      errorNotification.classList.add('show');
    }, 10);

    // Remove error after 3 seconds
    setTimeout(() => {
      this.removeExistingErrors();
    }, 3000);
    this.log(message, 'warn');
  }

  removeExistingErrors() {
    const existingErrors = document.querySelectorAll('.error-notification');
    existingErrors.forEach((error) => {
      error.classList.remove('show');
      error.remove();
    });
  }
}

export default ErrorHandler;
