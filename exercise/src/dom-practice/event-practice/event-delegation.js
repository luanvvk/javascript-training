const form = document.querySelector('#form');
const itemList = document.querySelector('.list_items');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const userName = document.querySelector('.username').value;
  const message = document.querySelector('.message').value;

  const newMessage = document.createElement('li');
  if (userName !== '' && message !== '') {
    newMessage.textContent = userName + ' : ' + message;
  } else return;
  itemList.appendChild(newMessage);
  form.reset();
});
//remove <li> only when click
itemList.addEventListener('click', function (e) {
  // const li = e.target;
  // // console.log(li.tagName);
  // // console.log(e.target.tagName);
  // if (li.tagName === 'LI') {
  //   li.remove();
  // }
  const li = e.target.closest('li');
  if (!li) return;
  if (!itemList.contains(li)) return;
  li.remove();
});

//exercise: remove element content when button is clicked
const content = document.getElementById('container');
content.addEventListener('click', function (event) {
  if (event.target.className !== 'remove-button') return;
  const pane = event.target.closest('.pane');
  pane.remove();
});
//create alerts to show which button was clicked
const buttonContainer = document.getElementById('button-container');
const addButton = document.getElementById('add-button');

addButton.addEventListener('click', () => {
  const newButton = document.createElement('button');
  newButton.textContent = `Button ${buttonContainer.children.length + 1}`;
  newButton.classList = 'button';
  buttonContainer.appendChild(newButton);
});

buttonContainer.addEventListener('click', (event) => {
  if (event.target.matches('.button')) {
    alert(`${event.target.textContent} was clicked`);
    event.target.classList.toggle('clicked');
  }
});
//Print whatever user key in to console log
const userForm = document.getElementById('user-form');

userForm.addEventListener('input', (event) => {
  const { name, value } = event.target;
  console.log(`Update ${name}: ${value}`);
});
