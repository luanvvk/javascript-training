const sortDropdown = document.getElementById('sort-dropdown');
const filterFieldDropdown = document.getElementById('filter-field-dropdown');
const sortOrderToggle = document.getElementById('sort-order-toggle');
export function renderSortingUI() {
  if (sortDropdown) {
    sortDropdown.innerHTML = '';
    const sortOptions = [
      { value: 'name', label: 'By name' },
      { value: 'startDate', label: 'By start date' },
      { value: 'endDate', label: 'By end date' },
      { value: 'priority', label: 'By priority' },
      { value: 'category', label: 'By category' },
    ];
    sortOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      sortDropdown.appendChild(optionElement);
    });
  }
  //Render filter field dropdown
  if (filterFieldDropdown) {
    filterFieldDropdown.innerHTML = '';
    const filterFieldOptions = [
      { value: 'category', label: 'Category' },
      { value: 'priority', label: 'Priority' },
      { value: 'status', label: 'Status' },
    ];
    filterFieldOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      filterFieldDropdown.appendChild(optionElement);
    });
  }
  //Add sort order toggle
  if (!sortOrderToggle) {
    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');
    sortContainer.innerHTML = `
     <label for="sort-dropdown" class="sort-label">Sort by:</label>
      <div class="sort-dropdown-content">
        <select id="sort-dropdown">
         
        </select>
        <button id="sort-order-toggle"><i class="fa-solid fa-sort"></i></button>
      </div>
    `;
    document.querySelector('#task-controls').appendChild(sortContainer);
  }
}
