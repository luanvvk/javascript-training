class Automobile {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }
  yearRelease() {
    console.log(`${this.brand} was released in ${this.year}`);
  }
}

class Car extends Automobile {
  yearRelease() {
    console.log(this.brand + ' was released in ' + this.year);
  }
}
let car1 = new Car('Ford ranger', '2022');
let car2 = new Car('Honda civic', '2023');
let car3 = new Car('Toyota camry', '2024');
car1.yearRelease();
car2.yearRelease();
car3.yearRelease();

class myCar extends Automobile {
  constructor(brand, year, color) {
    super(brand, year);
    this.color = color;
  }
  yearRelease() {
    super.yearRelease();
    console.log(`${this.brand} was released in ${this.year} and has ${this.color} color`);
  }
}
let car4 = new myCar('Audi', '2025', 'red');
car4.yearRelease();

//

class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

class Student extends Person {
  constructor(name, subject) {
    super(name);
    this.subject = subject;
  }
  greet() {
    console.log(`Hello, my name is ${this.name} and i am learning ${this.subject}`);
  }
}

let student1 = new Student('Luan Vu', 'Javascript');
student1.greet();

//

class Animal {
  constructor(name) {
    this.name = name;
  }
  run(speed) {
    this.speed = speed;
    console.log(`${this.name} runs at ${this.speed} km/h`);
  }
  hunt() {
    console.log(`${this.name} is hunting.`);
  }
}

class Cat extends Animal {
  catch() {
    console.log(`${this.name} catches mouse`);
  }

  hunt() {
    super.hunt();
    this.catch();
  }
}

let cat = new Cat('Black cat');
cat.run(15);
cat.hunt();
