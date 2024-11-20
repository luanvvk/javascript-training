//event demo
const button1 = document.querySelector('.button1');
button1.addEventListener('click', (event) => {
  alert('This button is created using event listener');
  document.write('<h1>Hello</h1>');
});

const changeText = () => {
  const textToChange = document.querySelector('.text1');
  textToChange.textContent = 'This is from inline event handler';
};

const button3 = document.querySelector('.button3');
button3.onclick = () => alert('this is from the event handler property');

// create a button in js file and add it to html
const button4 = document.createElement('button');
button4.textContent = 'Hey, Im button 4';
button4.addEventListener('click', () => alert('I was created in Js file'));
document.body.appendChild(button4);

//change background of a box when hover and click
function changeColor(elementToChange, color) {
  const box = document.querySelector('.elementToChange');
  if (box) {
    box.addEventListener('mouseenter', (event) => {
      box.style.backgroundColor = 'red';
    });
    box.addEventListener('click', (event) => {
      box.style.backgroundColor = color;
    });
  }
}
changeColor('elementToChange', 'green');
// Change button effect when click and when double click
const btn5 = document.querySelector('.button5');
btn5.addEventListener('click', () => {
  btn5.style.backgroundColor = 'red';
  btn5.style.textTransform = 'capitalize';
});
btn5.addEventListener('dblclick', () => {
  btn5.style.border = '1px solid black';
  btn5.style.color = 'blue';
  btn5.style.backgroundColor = 'green';
  btn5.style.textTransform = 'upperCase';
});
// Change image when pressing button

let currentIndex = 0;
const imgList = [
  './images/animal-images/bear.jfif',
  './images/animal-images/cat.jfif',
  './images/animal-images/tiger.jfif',
  './images/animal-images/dog.jfif',
  './images/animal-images/monkey.jfif',
  './images/animal-images/elephane.jfif',
];
let previousBtn = document.querySelector('.previousBtn');
let nextBtn = document.querySelector('.nextBtn');
const images = document.querySelector('.images');
previousBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
  images.src = imgList[currentIndex];
});
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1 + imgList.length) % imgList.length;
  images.src = imgList[currentIndex];
});

// Drop down menu
const menuBtn = document.querySelector('.menu-button');
const dropDownItems = document.querySelector('.dropdown-menu__items');
menuBtn.addEventListener('click', () => {
  dropDownItems.style.display = dropDownItems.style.display === 'none' ? 'block' : 'none';
});
