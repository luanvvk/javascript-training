//Exercise 1:
/** function js_style() {
//   text.style.fontSize = '16px';
//   text.style.fontFamily = 'Arial san serif';
//   text.style.color = 'blue';
//   text.style.textTransform = 'upperCase';
 }*/
const styleButton = document.getElementById('jsstyle');
const changedText = document.getElementById('text');
styleButton.addEventListener('click', changeText);
changedText.className = 'active';
function changeText() {
  changedText.classList.toggle('active');
}

//Exercise 2:
function getFormValue() {
  const formData = document.getElementById('form1');
  for (let i = 0; i < formData.length; i++) {
    if (formData.elements[i].value != 'Submit') {
      console.log(formData.elements[i].value);
    }
  }
}
//Exercise 3:
const textToChange = document.getElementsByClassName('paragraph');
function setColor() {
  let p1 = textToChange[0];
  let p2 = textToChange[1];
  let p3 = textToChange[2];
  p1.style.backgroundColor = 'red';
  p2.style.backgroundColor = 'blue';
  p3.style.backgroundColor = 'yellow';
}
//Exercise 4:
const typeAttr = document.getElementById('w3r').type;
const hrefLangAttr = document.getElementById('w3r').hreflang;
const relAttr = document.getElementById('w3r').rel;
const targetAttr = document.getElementById('w3r').target;
const hrefAttr = document.getElementById('w3r').href;

function getAttributes() {
  console.log(`type = ${typeAttr}, hreflang = ${hrefLangAttr},
     rel = ${relAttr}, target = ${targetAttr}, href = ${hrefAttr}
  `);
}
//Exercise 5:
const tableData = document.getElementById('sampleTable');
function insert_row() {
  const newRow = tableData.insertRow(2);
  const newCell1 = newRow.insertCell(0);
  const newCell2 = newRow.insertCell(1);
  newCell1.innerHTML = 'New Cell 1';
  newCell2.innerHTML = 'New Cell 2';
}
//Exercise 6:
const tableData2 = document.getElementById('myTable');
function insert_row2() {
  const newRow = tableData2.insertRow(3);
  const newCell1 = newRow.insertCell(0);
  const newCell2 = newRow.insertCell(1);
  newCell1.innerHTML = 'New Cell 1';
  newCell2.innerHTML = 'New Cell 2';
}

function changeContent() {
  const rowInput = window.prompt('Choose the row number you want to change:', '0') - 1;
  const columnInput = window.prompt('Choose the column number you want to change:', '0') - 1;
  const newContent = window.prompt('New content is:');
  const targetRow = document.getElementById('myTable').rows[parseInt(rowInput, 10)].cells;
  const targetCell = targetRow[parseInt(columnInput, 10)];
  targetCell.innerHTML = newContent;
}
/** let button = document.getElementById('ex6-button');
button.addEventListener('click', changeCellContent);
function changeCellContent() {
  const rowInput = window.prompt('Choose the row number you want to change:', '0') - 1;
  const columnInput = window.prompt('Choose the column number you want to change:', '0') - 1;
  const newContent = window.prompt('New content is:');
  document.querySelector('tr'[rowInput].children[columnInput]).textContent = newContent;
}*/

//Exercise 7:
function createTable() {
  let rowInput = window.prompt('Input number of rows', 10);
  let columnInput = window.prompt('Input number of columns', 10);

  for (var i = 0; i < parseInt(rowInput, 10); i++) {
    var rowInsert = document.getElementById('myTable2').insertRow(i);
    for (var j = 0; j < parseInt(columnInput, 10); j++) {
      var columnInsert = rowInsert.insertCell(j);
      columnInsert.innerHTML = 'Row-' + (i + 1) + ' Column-' + (j + 1);
    }
  }
}
//Exercise 8
const targetOption = document.getElementById('colorSelect');
function removeOption() {
  targetOption.remove(targetOption.selectedIndex);
}
function addOption() {
  const input = window.prompt('Add the new color:');
  var newOption = document.createElement('option');
  newOption.setAttribute('value', 'color');
  var optionContent = document.createTextNode(`${input}`);
  newOption.appendChild(optionContent);
  targetOption.appendChild(newOption);
}
//Ex9
function getOptions() {
  const selectData = document.getElementById('mySelect');
  let showText = 'Number of options : ';
  let length = selectData.length;
  showText += length;
  for (let i = 0; i < length; i++) {
    showText = showText + '\n' + selectData.options[i].text;
  }
  alert(showText);
}

//Ex10:
function calculateVolume() {
  const radius = document.getElementById('radius').value;
  if (radius >= 0) {
    let volume = (4 / 3) * Math.pow(radius, 3);
    volume = volume.toFixed(4);
    document.getElementById('volume').value = volume;
  } else {
    alert('Please key in a positive number');
  }
}
//Ex11:
function showImages() {
  let images = [
    {
      link: 'http://farm4.staticflickr.com/3691/11268502654_f28f05966c_m.jpg',
      width: '240',
      height: '160',
    },
    {
      link: 'http://farm1.staticflickr.com/33/45336904_1aef569b30_n.jpg',
      width: '320',
      height: '195',
    },
    {
      link: 'http://farm6.staticflickr.com/5211/5384592886_80a512e2c9.jpg',
      width: '500',
      height: '343',
    },
  ];

  let random = Math.floor(Math.random() * images.length);

  let image = document.createElement('img');
  image.src = images[random].link;
  image.width = images[random].width;
  image.height = images[random].height;

  let displayImages = document.getElementsByTagName('img');
  if (displayImages.length > 0) {
    document.body.replaceChild(image, displayImages[0]);
  } else {
    document.body.appendChild(image);
  }
}
//EX12:
const boldItems = document.getElementsByTagName('strong');
function highlight() {
  for (let i = 0; i < boldItems.length; i++) {
    boldItems[i].style.color = 'red';
  }
}
function normalState() {
  for (let i = 0; i < boldItems.length; i++) {
    boldItems[i].style.color = 'black';
  }
}
//Ex13:
const currentHeight = document.querySelector('#height');
const currentWidth = document.querySelector('#width');
function showCurrentSize() {
  currentHeight.textContent = window.innerHeight;
  currentWidth.textContent = window.innerWidth;
}
window.onresize = showCurrentSize;
