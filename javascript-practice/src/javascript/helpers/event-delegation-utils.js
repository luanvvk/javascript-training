import ErrorHandler from './error-handler-utils';

class EventDelegate {
  constructor() {
    this.handlers = new Map();
    this.errorHandler = new ErrorHandler();
  }

  addEventDelegation(parentSelector, eventType, childSelector, handler) {
    const parent = document.querySelectorAll(parentSelector);
    if (!parent) {
      this.errorHandler.log(`Parent element not found: ${parentSelector}`, 'warn');
    }

    const eventHandler = (event) => {
      const matchingChild = event.target.closest(childSelector);
      if (matchingChild && parent.contains(matchingChild)) {
        handler(event, matchingChild);
      }
    };
    this.handlers.set(handler, eventHandler);
    parent, addEventListener(eventType, eventHandler);
  }
}

export default EventDelegate;
