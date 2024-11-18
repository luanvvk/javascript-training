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
