let user = {
  firstName: 'Hung',
  lastName: 'Nguyen',
};
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
console.log(getFullName(user));

const arr = [1, 2, 3, 4];
const [first, second] = arr;
console.log(first);
console.log(second);

const foo = 1;
let bar = foo;
bar = 9;
console.log(foo, bar);

const foo1 = [1, 2];
const bar1 = foo1;
bar1[0] = 9;
console.log(foo1[0], bar1[0]);
{
  let a = 1;
  const b = 1;
  var c = 1;
}
// console.log(a);
// console.log(b);
console.log(c);

const obj = {
  id: 5,
  name: 'x',
  [getKey('enable')]: true,
};
function getKey(k) {
  return `a key name ${k}`;
}
console.log(obj);

const atom2 = {
  value: 1,
  addValue2(value) {
    return atom.value + value;
  },
};
console.log(atom2);

const likeS = 'Luke S';
const object = {
  likeS,
};
console.log(object);

const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 };
console.log(copy);
const { a, ...noA } = copy;
console.log(noA);

const someStack = [];
someStack.push('asda');
console.log(someStack);
someStack.pop();
console.log(someStack);

//
const item = [1, 2, 3, 4];
const itemCopy = [...item];
console.log(itemCopy);
//convert an iterable object
const foo2 = document.querySelectorAll('.foo');
const nodes2 = [...foo2];
console.log(nodes2);

//convert array like object
const arrayLike = {
  0: 'foo',
  1: 'bar',
  length: 4,
};
const arr1 = Array.from(arrayLike);
console.log(arr1);

function sayHi(name) {
  return `How are you, ${name} ?`;
}
console.log(sayHi('Luan'));

(function () {
  console.log('Welcome to the Internet. Please follow me.');
})();

const x = [1, 2, 3, 4, 5];
console.log(...x);

const y = new Date(...[2016, 8, 8]);
console.log(y);

const numbers = [2, 5, 6];
const newArr = numbers.map(myFunction);
function myFunction(number) {
  return number * 10;
}
console.log(newArr);

const luke = {
  jedi: true,
  lastName: 'V',
  age: 28,
};
const ln = luke.lastName;
console.log(ln);

function getAge(prop) {
  return luke[prop];
}
const ageNumber = getAge('age');
console.log(ageNumber);
