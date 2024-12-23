class ErrorHandler {
  log(message, type = 'error') {
    const time = new Date().toISOString();
    const logMessage = `[${time}] ${type.toUpperCase()}: ${message}`;

    // Console logging
    console[type](logMessage);
  }

  showError(message) {
    this.removeExistingErrors();

    let errorNotification = document.querySelector('.error-notification');
    if (!errorNotification) {
      errorNotification = document.createElement('div');
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
    }

    errorNotification.querySelector('.error-message').textContent = message;
    errorNotification.classList.remove('hide');
    errorNotification.classList.add('show');

    setTimeout(() => {
      errorNotification.classList.remove('show');
      errorNotification.classList.add('hide');
    }, 3000);
  }

  removeExistingErrors() {
    try {
      const existingErrors = document.querySelector('.error-notification');
      if (existingErrors) {
        existingErrors.classList.remove('show');
        existingErrors.classList.add('hide');
      }
    } catch (error) {
      this.log(`Fail to remove existing error: ${error.message}`, 'error');
    }
  }
}

export default ErrorHandler;
