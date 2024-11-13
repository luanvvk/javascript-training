var myCar = {
  brand: 'Ford',
  year: '2020',
  color: 'blue',
  run: function () {
    return 'run at 50 km/hr';
  },
};
console.log(myCar);
for (var key in myCar) {
  console.log(myCar[key]);
}
console.log(Object.keys(myCar));
for (let value of Object.keys(myCar)) {
  console.log(myCar[value]);
}
let carBrand = myCar.brand;
let releaseYear = myCar.year;
let carSpeed = myCar.run();
console.log('The brand of the car is:', carBrand);
console.log('The year this car was released:', releaseYear);
console.log('This car can run at:', carSpeed);

function User(firstName, lastName, avatar) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.avatar = avatar;
  this.getName = function () {
    return `${this.firstName} ${this.lastName}`;
  };
}

User.prototype.company = 'agility';
User.prototype.getCompanyName = function () {
  return this.company;
};
let mentor = new User('Minh', 'Tran', 'Avatar');
let supporter = new User('Thinh', 'Nguyen', 'Avatar');
supporter.comment = 'try your best';
console.log(mentor);
console.log(supporter);
console.log(mentor.constructor === User);
console.log(supporter.getName());
console.log(mentor.getName());
console.log(mentor.company);
console.log(supporter.getCompanyName());

let date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDay();

console.log(typeof date);
console.log(year);
console.log(month);
console.log(day);
console.log(`${day}/${month}/${year}`);
