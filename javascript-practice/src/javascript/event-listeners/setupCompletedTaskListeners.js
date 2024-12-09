class SetupCompletedTaskListeners {
  setupCompletedTaskListeners() {
    const completedBtns = document.querySelectorAll('.confirm-button');

    completedBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const taskElement = button.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.taskId);

        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          // Update task status
          this.tasks[taskIndex].status =
            this.tasks[taskIndex].status === 'Completed' ? 'In Progress' : 'Completed';

          this.renderTasks();
        }
      });
    });
  }
}
export default SetupCompletedTaskListeners;
