//Access Element
const demoId = document.getElementById('demo');
const demoClass = document.getElementsByClassName('demo');
const demoTag = document.getElementsByTagName('section');
const demoQuery = document.querySelector('#demo-query');
const demoQueryAll = document.querySelectorAll('.demo-query-all');

demoId.style.border = '1px solid purple';
demoId.style.color = 'blue';
demoId.style.backgroundColor = 'red';
demoId.style.textTransform = 'upperCase';

for (i = 0; i < demoClass.length; i++) {
  demoClass[i].style.border = '1px solid orange';
}
demoClass[1].style.background = 'yellow';

for (i = 0; i < demoTag.length; i++) {
  demoTag[i].style.border = '1px solid blue';
}

demoQuery.style.border = '1px solid red';

demoQueryAll.forEach((query) => {
  query.style.border = '1px solid green';
});

const articleTag = document.getElementsByTagName('article')[0];
const articleTag2 = document.querySelector('article');
let articleTag3 = document.querySelectorAll('article');

articleTag.style.backgroundColor = 'orange';
articleTag2.style.backgroundColor = 'green';
articleTag3.forEach((query) => {
  query.style.backgroundColor = 'blue';
});

//transverse DOM
const ulTag = document.getElementsByTagName('ul')[0];
let pTag = document.getElementsByTagName('p')[0];
let pTagClass = document.getElementsByClassName('pClass')[0];

ulTag.style.listStyle = 'none';
ulTag.style.textTransform = 'Capitalize';
console.log(ulTag.childNodes);
console.log(ulTag.firstChild);
console.log(ulTag.lastChild);
for (let i = 0; i < ulTag.children.length; i++) {
  console.log(ulTag.children[i]);
}
console.log(ulTag.firstElementChild);
console.log(ulTag.lastElementChild);

for (let element of ulTag.children) {
  element.style.background = 'yellow';
}
ulTag.firstElementChild.style.color = 'brown';

pTag.className = 'pClass';
console.log(pTag.parentElement);
console.log(pTag.parentNode);
console.log(pTag.parentNode.parentNode);

//Modifying attribute and style
console.log(pTag.hasAttribute('class'));
console.log(pTag.getAttribute('class'));
pTag.setAttribute('id', 'pId');
console.log(pTag);

let pTag2 = document.getElementById('pId');
const headingClass = document.querySelector('h3');
let imgClass = document.querySelector('img');
const aTag = document.querySelectorAll('a')[0];

console.log(pTag2);
pTag2.style.border = '1px solid red';
pTag2.style.color = 'purple';
pTag.setAttribute('class', 'pClass2');

headingClass.className = 'h3-class';
headingClass.setAttribute('style', 'font-size: 24px');
headingClass.style.textAlign = 'center';
headingClass.style.textTransform = 'upperCase';
headingClass.classList.add('active');
console.log(headingClass);

imgClass.classList.add('warning');
imgClass.style.width = '300px';
imgClass.style.height = '300px';
imgClass.classList.toggle('warning');
imgClass.classList.add('dangerous');
console.log(imgClass);
console.log(imgClass.classList.contains('dangerous'));
console.log(imgClass.classList.contains('active'));
imgClass.classList.replace('dangerous', 'active');
console.log(imgClass);
imgClass.classList.toggle('warning');
imgClass.classList.remove('warning');
imgClass.removeAttribute('src');
imgClass.setAttribute('src', './microsoft.png');

console.log(aTag);
aTag.setAttribute('href', 'https://www.microsoft.com/en-us/software-download/windows11');
aTag.style.color = 'white';
aTag.style.fontSize = '18px';

//use innerHTML, innerText, textContent
console.log(ulTag.innerHTML);
console.log(ulTag.innerText);
console.log(ulTag.textContent);

ulTag.innerHTML = `
        <li>cat</li>
        <li>dog</li>
        <li>pig</li>
        <li>bird</li>
        <li>monkey</li>
`;
console.log(ulTag.firstElementChild);
// ulTag.innerText = `
//         <li>cat</li>
//         <li>dog</li>
//         <li>pig</li>
//         <li>bird</li>
//         <li>monkey</li>
// `;

// ulTag.textContent = `
//         <li>cat</li>
//         <li>dog</li>
//         <li>pig</li>
//         <li>bird</li>
//         <li>monkey</li>
// `;
console.log(ulTag.innerHTML);
console.log(ulTag.innerText);
console.log(ulTag.textContent);
