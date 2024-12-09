class SetupEditTaskListeners {
  setupEditTaskListeners() {
    const editBtns = document.querySelectorAll('.task-edit');
    const editOverlay = document.getElementById('edit-task-overlay');

    editBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const taskElement = button.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.taskId);
        const task = this.tasks.find((t) => t.id === taskId);

        if (task) {
          // Populate edit overlay with task details
          const titleInput = editOverlay.querySelector('#task-title');
          const startDateInput = editOverlay.querySelector('#start-date');
          const endDateInput = editOverlay.querySelector('#end-date');

          titleInput.value = task.title;
          startDateInput.value = task.startDate;
          endDateInput.value = task.endDate;

          // Show edit overlay
          editOverlay.classList.remove('hide');
          document.body.classList.add('overflow-hidden');

          // Setup confirm edit button
          const confirmEditBtn = editOverlay.querySelector('.edit-controls .edit-task-button');
          confirmEditBtn.onclick = () => this.updateTask(taskId);
        }
      });
    });

    // Cancel edit button
    const cancelEditBtn = document.querySelector('.edit-controls .cancel');
    cancelEditBtn.addEventListener('click', () => {
      editOverlay.classList.add('hide');
      document.body.classList.remove('overflow-hidden');
    });
  }
}
export default SetupEditTaskListeners;
