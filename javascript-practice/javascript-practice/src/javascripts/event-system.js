class EventSystem {
  constructor() {
    this.events = {};
  }

  /**
   *  Register an event listener for a specific event
   * @param {string} event = name of the event to listen for
   * @param {function} callback - a callback function to execute when event is released.
   */

  registerEvent(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Release an event and trigger all registered listeners needed for that event
   * @param {string} event - name of event to release
   * @param data - data which passes to the event listeners
   */
  releaseEvent(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }
}
export default EventSystem;
