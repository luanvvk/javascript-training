class SetupDeleteTaskListeners {
  setupDeleteTaskListeners() {
    const deleteBtns = document.querySelectorAll('.task-delete');
    const notification = document.getElementById('notification');

    deleteBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const taskElement = button.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.taskId);

        // Remove task from tasks array
        this.tasks = this.tasks.filter((t) => t.id !== taskId);

        // Re-render tasks
        this.renderTasks();

        // Show notification
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3000);
      });
    });
  }
}
export default SetupDeleteTaskListeners;
