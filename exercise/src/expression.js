let a =1;
let b= 2;
var c = 'hai';
var output= b++ + --b;
var output2= b+c;
console.log(a/b);
console.log(a+b);
console.log(a-b);
console.log(a%b);
console.log(a**b);
console.log(a++);
console.log(a--);
console.log(output);
console.log(output2);
 if (a<b) {
    console.log('a is smaller than b');
    a++;
 } else {
   console.log('a is bigger than b');
 };

 if (a>b) {
    console.log('a is smaller than b');
    a++;
 } else {
   console.log('a is bigger than b');
 };

 if (a<=b) {
    console.log('a is smaller than b');
    b--;
 } else {
   console.log('a is bigger than b');
 };

 if (a>=b) {
    console.log('a is smaller than b');
    b++
 } else {
   console.log('a is bigger than b');
 };
 
 if (a>0 && b>0) {
    console.log('a and b are positive numbers');
    a-=2;
 } else {
    console.log('a and b are negative numbers');
 }

 if (a>0 && b>0) {
    console.log('a and b are positive numbers');
    a+=2;
 } else {
    console.log('a and b are negative numbers');
 }

 if (a>0 || b>0) {
    console.log('a and b are positive numbers');
    a-=2;
 } else {
    console.log('a and b are negative numbers');
 }