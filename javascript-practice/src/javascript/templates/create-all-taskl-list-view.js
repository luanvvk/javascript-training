export function createAllTasksListView(tasks) {
  // Create main container for list view
  const listViewContainer = document.createElement('div');
  listViewContainer.classList.add('all-tasks-list-view');

  // Create table structure
  const table = document.createElement('table');
  table.classList.add('tasks-list-table');

  // Create table header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Title</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Priority</th>
      <th>Category</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  tasks.forEach((task) => {
    const row = document.createElement('tr');
    row.dataset.taskId = task.id;
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.startDate || 'N/A'}</td>
      <td>${task.endDate || 'N/A'}</td>
      <td>
        <span class="priority-badge priority-${task.priority.toLowerCase().replace(/\s+/g, '-')}">
          ${task.priority}
        </span>
      </td>
      <td>${task.category}</td>
      <td>
        <span class="status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}">
          ${task.status}
        </span>
      </td>
      <td>
        <div class="task-list-actions">
          <button class="task-edit" aria-label="Edit Task">
            <img src="./assets/images/icons/edit-icon.svg" alt="Edit"/>
          </button>
          <button class="task-delete" aria-label="Delete Task">
            <img src="./assets/images/icons/delete-icon.svg" alt="Delete"/>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  listViewContainer.appendChild(table);

  return listViewContainer;
}
