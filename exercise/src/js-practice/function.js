function showName() {
  let name = 'Luan Vu';
  console.log(name);
}
showName();

function multiplication(a, b) {
  let result = a * b;
  console.log(result);
}
let a = 15,
  b = 5;
multiplication(a, b);

//calculate discount price
function calculateDiscount(price, discountPercent) {
  return price - (price * discountPercent) / 100;
}
let originalPrice = 99000;
let discount = 30;
let discountedPrice = calculateDiscount(originalPrice, discount);
console.log(
  'Original Price: ' + originalPrice + ' vnd' + ', Discounted Price: ' + discountedPrice + ' vnd',
);

//age verification
function testAge(age) {
  if (age >= 18) {
    return 'adult';
  } else if (age > 12 && age < 18) {
    return 'teen';
  } else {
    return 'kid';
  }
}
let userAge = 17;
let result = testAge(userAge);
console.log('The user is: ' + result);

//calculate volume
function calcVolume(width, length, height) {
  return width * length * height;
}
let volume = calcVolume(5, 10, 15);
console.log('The volume is: ' + volume + ' cubic units');

// function expression:
let func = function () {
  alert('Hello');
};
func();

// func expression vs function declaration
//func declaration
sayHello('Luan'); //hoisting
function sayHello(name) {
  console.log(`Hello, ${name}`);
}
//func expression
// sayHello2('Luan'); //Error: cant do hoisting
let sayHello2 = function (name) {
  console.log(`Hello, ${name}`);
};

// still hoisting if we put func expression in function declaration
console.log(showGender());
function showGender() {
  var getGender = function () {
    return 'male';
  };
  return getGender();
}
// arrow function
let sayHello3 = () => console.log('Hello');
sayHello3();

const example = () => {
  console.log('Hello world!');
  console.log('sample text');
};
example();

const array = [1, 2, 3, 4];
array.forEach((item) => console.log(item));

const sum = (a, b) => {
  const result = a + b;
  return result;
};
console.log(sum(2, 3));

//arrow function doesnot have .this binding
const user = {
  name: 'Luan',
  age: 33,
  getAge: () => {
    console.log(`${this.name} is ${this.age} years old`);
  },
};
user.getAge();
//this in normal function works okay
const user2 = {
  name: 'Luan',
  age: 33,
  getAge2: function () {
    console.log(`${this.name} is ${this.age} years old`);
  },
};
user2.getAge2();

//Anonymous function:
let anonymousFunc = function () {
  console.log('This is an anonymous function');
};
anonymousFunc();
// passing anonymous function as parameter
function greet(message) {
  console.log(message(), 'guys');
}
greet(function () {
  return 'Good morning';
});

//IIFE
(function () {
  console.log('I am an immediately invoked function execution');
})();

const user3 = {
  name: 'Luan',
  age: 33,
};
(function () {
  console.log(`${user3.name} is ${user3.age} years old`);
})(user3);

// High order function: pass function as arguments and return a function
function greetToLady() {
  console.log('Hello, darling!!!');
}
function greetToGents() {
  console.log("What's up, guys");
}
let myGreet = (gender, ladyGreet, gentGreet) => {
  if (gender === 'female') {
    ladyGreet();
  } else if (gender === 'male') {
    gentGreet();
  }
};
myGreet('female', greetToLady, greetToGents);
myGreet('male', greetToLady, greetToGents);

//HOF: Array.prototype.map
const array1 = [1, 2, 3, 4];
const array2 = array1.map((item) => item * 2);
console.log(array2);
//
const courses = ['java', 'c', 'javascript', 'python'];
const getUpperCase = courses.map((course) => course.toUpperCase());
console.log(getUpperCase);
//HOF: Array.prototype.filter
const nums = [1, 2, 3, 4, 5];
const oddnums = nums.filter((num) => num % 2 !== 0);
console.log(oddnums);
//
const users = [
  { name: 'A', id: 1 },
  { name: 'B', id: 2 },
  { name: 'C', id: 3 },
  { name: 'D', id: 4 },
];
const filterId = users.filter((user) => user.id > 2);
console.log(filterId);
//HOF: Array.prototype.reduce
const array3 = [1, 2, 3, 4, 5];
const total = array3.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
});
console.log(total);
//HOF: Array.prototype.forEach
const numbers = [1, 2, 3, 4, 5];
numbers.forEach((num) => console.log(num));

const words = ['Hi', 'Hello', 'goodday'];
words.forEach((word, i) => console.log(words[i] + ' ' + word.length));

//closure example1
function getName() {
  let name = 'A';
  return function () {
    console.log(name);
  };
}
let name = 'B';
let userName = getName();
userName();
//example2:
function outputMessage(firstName, lastName) {
  function getFullName() {
    return `${firstName} ${lastName}`;
  }
  console.log('Good morning, ' + getFullName());
  console.log('Have a good day, ' + getFullName());
}
outputMessage('Luan', 'Vu');
//How closure access variable in its lexical environment
let globalVar = 'World';
function greetHello(name) {
  let outerFuncVar = 'Hello';
  function speak() {
    let localVar = `${outerFuncVar}, ${globalVar}. I am ${name}`;
    console.log(localVar);
  }
  speak();
}
greetHello('Luan');

//closure store variable of outer function by reference:
function userId() {
  let id = 1;
  return {
    getId: function () {
      return id;
    },
    setId: function (_id) {
      id = _id;
    },
  };
}
let myUser = userId();
console.log(myUser.getId());

myUser.setId(5);
console.log(myUser.getId());
