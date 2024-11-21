let key = 'item1';
localStorage.setItem(key, 'Value1');
console.log(localStorage);
let myItem = localStorage.getItem(key);
console.log(myItem);
localStorage.setItem(key, 'Value 2');
let myItem2 = localStorage.getItem(key);
console.log(localStorage);
console.log(myItem2);
localStorage.removeItem(key);
console.log(localStorage);

//store nonstring value with JSON

let object1 = { name: 'John', sex: 'male' };
localStorage.setItem(key, JSON.stringify(object1));
console.log(JSON.parse(localStorage.getItem(key)));

let object2 = { name: 'Ann', sex: 'female', age: 28 };
localStorage.setItem(key, JSON.stringify(object2));
console.log(JSON.parse(localStorage.getItem(key)));
console.log(localStorage);

let object3 = { color: 'blue', type: 'car' };
localStorage.setItem(key, JSON.stringify(object3));
console.log(JSON.parse(localStorage.getItem(key)));
console.log(localStorage);

//get value of key in the object like
//1st way
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  alert(`${key}: ${localStorage.getItem(key)}`);
}
//2nd way
for (let key in localStorage) {
  if (!localStorage.hasOwnProperty(key)) {
    continue;
  }
  alert(`${key}: ${localStorage.getItem(key)}`);
}
//3rd way
let keys = Object.keys(localStorage);
for (let key of keys) {
  alert(`${key}: ${localStorage.getItem(key)}`);
}

localStorage.user = { name: 'John' };
alert(localStorage.user);
localStorage.user = JSON.stringify({ name: 'John' });
let user = JSON.parse(localStorage.user);
alert(user.name);
console.log(localStorage);

// store text area
area.value = localStorage.getItem('area');
area.oninput = () => {
  localStorage.setItem('area', area.value);
};
// store email
email.value = localStorage.getItem('email');
email.oninput = () => {
  localStorage.setItem('email', email.value);
};
