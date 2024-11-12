let car = {
  brand: 'Ford',
  year: '2020',
  color: 'blue',
  run: function () {
    return 'run at 50 km/hr';
  },
};
console.log(car);

let carBrand = car.brand;
let releaseYear = car.year;
let carSpeed = car.run();
console.log('The brand of the car is:', carBrand);
console.log('The year this car was released:', releaseYear);
console.log('This car can run at:', carSpeed);
