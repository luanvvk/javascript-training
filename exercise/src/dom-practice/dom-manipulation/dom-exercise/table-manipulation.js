let tasks = [];
const pomForm = document.querySelector('.add-task');
const tableBody = document.querySelector('.task-body');
const addTask = function (e) {
  e.preventDefault();
  const taskName = this.querySelector('#task-name').value;
  const pomCount = this.querySelector('#pomodoro-count').value;
  this.reset();
  tasks.push({
    taskName,
    pomDone: 0,
    pomCount,
    finished: false,
  });
  renderTasks(tableBody, tasks);
};
pomForm.addEventListener('submit', addTask);
const renderTasks = function (tBodyNode, tasks = []) {
  tBodyNode.innerHTML = tasks
    .map(
      (task, id) =>
        `<tr>
  <td>${task.taskName}</td>
  <td>${task.pomDone}/${task.pomCount} pomodori</td>
  <td>
  ${
    task.finished
      ? 'Finished'
      : `
    <button class= "task-done" data-id="${id}">Done</button>
    <button class= "increase-pom" data-id="${id}">Increase Pomodoro Count</button>`
  }
    <button class= "delete-row" data-id="${id}">Delete Task</button>
    </td>
    </tr>
  `,
    )
    .join('');
};
const finishTask = (tasks, taskId) => {
  tasks[taskId].finished = true;
};
const increasePomDone = (tasks, taskId) => {
  tasks[taskId].pomDone += 1;
};
const deleteTask = (tasks, taskId) => {
  tasks.splice(taskId, 1);
};
const handleButtonClick = function (event) {
  const taskId = event.target.dataset.id;
  if (event.target.classList == 'task-done') {
    finishTask(tasks, taskId);
  } else {
    if (event.target.classList == 'increase-pom') {
      increasePomDone(tasks, taskId);
    } else {
      if (event.target.classList == 'delete-row') {
        deleteTask(tasks, taskId);
      } else null;
    }
  }
  renderTasks(tableBody, tasks);
};
tableBody.addEventListener('click', handleButtonClick);
