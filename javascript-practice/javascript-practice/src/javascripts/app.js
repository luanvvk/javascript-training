import PopupController from './controllers/popup.js';
import SearchController from './controllers/search.js';
import NavigationController from './controllers/navigation.js';
import FilterController from './controllers/filter.js';
import TaskController from './controllers/task.js';

class App {
  init() {
    this.taskController = new TaskController();
    this.popupController = new PopupController(this.taskController);
    this.searchController = new SearchController(this.taskController);
    this.navigationController = new NavigationController();
    this.filterController = new FilterController(this.taskController);
  }
}
export default App;
