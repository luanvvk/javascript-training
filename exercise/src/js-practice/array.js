let a = ['Javascript', 'Java', 'PHP', 'C'];

console.log(a.length);
console.log(a);
console.log(typeof a);
a.length = 3;
console.log(a);
console.log(Array.isArray(a));
console.log(a.toString());
console.log(a.join('-'));
console.log(a.push('C++', 'C#'));
console.log(a);
console.log(a.pop());
console.log(a.shift());
console.log(a.unshift('C#'));
console.log(a);
console.log(a.splice(1, 1, 'Javascript'));
console.log(a);
var d = [2, 3, 4, 5];
console.log(a.concat(d));
console.log([...a, ...d]);

const b = [
  [1, 2, 3],
  [2, 3, 67],
  [1, 5, 6],
];
console.log(b);

let c = Array(12).fill(2);
console.log(c);

var animal = ['cat', 'dog', 'chicken', 'dog', 'duck', 'pig'];
const output = animal.find((element) => element === 'dog');
const output2 = animal.findIndex((element) => element === 'dog');
const output3 = animal.includes('chicken');
const output4 = animal.includes('chicken', 3);

console.log(output);
console.log(output2);
console.log(output3);
console.log(output4);

console.log(animal.slice(2));
console.log(animal.slice(2, 4));
console.log(animal.slice(2, -1));
