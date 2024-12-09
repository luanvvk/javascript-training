class ErrorToastMessage {
  showError(message) {
    // Create error notification
    const errorNotification = document.createElement('div');
    errorNotification.classList.add('error-notification');
    errorNotification.textContent = message;
    document.body.appendChild(errorNotification);

    // Remove after 3 seconds
    setTimeout(() => {
      errorNotification.remove();
    }, 3000);
  }
}
export default ErrorToastMessage;
