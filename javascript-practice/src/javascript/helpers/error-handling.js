// Show error notification
export function showError(message) {
  removeExistingErrors();
  const errorNotification = document.createElement('div');
  errorNotification.classList.add('error-notification');
  // Create error notification element
  errorNotification.innerHTML = `
     <div class="error-content">
       <img src="./assets/images/icons/error-icon/error-icon.svg" alt="Error Icon" class="error-icon">
       <span class="error-message">${message}</span>
     </div>
   `;
  const mainBody = document.querySelector('.main-body');
  const topBar = document.querySelector('.top-bar');
  const insertLocation = topBar || mainBody;
  if (insertLocation) {
    insertLocation.insertAdjacentElement('afterend', errorNotification);
  }

  setTimeout(() => {
    errorNotification.classList.add('show');
  }, 10);

  // Remove error after 3 seconds
  setTimeout(() => {
    removeExistingErrors();
  }, 3000);
}
export function removeExistingErrors() {
  const existingErrors = document.querySelectorAll('.error-notification');
  existingErrors.forEach((error) => {
    error.classList.remove('show');
    error.remove();
  });
}
