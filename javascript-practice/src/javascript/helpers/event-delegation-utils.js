import ErrorHandler from './error-handler-utils.js';

class EventDelegate {
  constructor() {
    this.handlers = new Map();
    this.errorHandler = new ErrorHandler();
  }

  addEventDelegation(parentSelector, eventType, childSelector, handler) {
    const parents = document.querySelectorAll(parentSelector);
    if (!parents.length) {
      this.errorHandler.log(`Parent element not found: ${parentSelector}`, 'warn');
      return;
    }

    const eventHandler = (event) => {
      const matchingChild = event.target.closest(childSelector);
      if (matchingChild) {
        handler(event, matchingChild);
      }
    };
    this.handlers.set(handler, eventHandler);
    parents.forEach((parent) => parent.addEventListener(eventType, eventHandler));
  }
}

export default EventDelegate;
