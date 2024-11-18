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
