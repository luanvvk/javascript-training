let list = document.querySelectorAll('.navbar--list__item');
function activeLink() {
  list.forEach((item) => {
    item.classList.remove('hovered');
  });
  this.classList.add('hovered');
}

list.forEach((item) => item.addEventListener('onmouseenter', activeLink));
// Menu Toggle
let toggle = document.querySelector('.menu-bar-toggle');
let sideNavbar = document.querySelector('.side-navbar');
let mainBody = document.querySelector('.main-body');
let appLogo = document.querySelector('.app-logo');

toggle.onclick = function () {
  sideNavbar.classList.toggle('active');
  mainBody.classList.toggle('active');
  appLogo.classList.toggle('active');
};

// radio buttons for view option
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById('list-view');
const boardView = document.getElementById('board-view');
radioViewOptions.forEach((radioButton) => {
  radioButton.addEventListener('change', (event) => {
    const eventTarget = event.target;
    const viewOption = eventTarget.value;

    switch (viewOption) {
      case 'board':
        listView.classList.add('hide');
        boardView.classList.remove('hide');
        break;
      case 'list':
        boardView.classList.add('hide');
        listView.classList.remove('hide');
        break;
    }
  });
});
