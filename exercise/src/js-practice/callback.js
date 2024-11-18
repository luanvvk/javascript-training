//callbacks
//1st way
function sayHello(name, callback1) {
  var myName = `Hello ${name}`;
  return callback1(myName);
}

var result = sayHello('Luan', function (arg) {
  return arg;
});

alert(result);

//2ns way
const sayHello2 = (name) => {
  console.log(`Hello ${name}`);
};

function operationCallback(name, callback2) {
  callback2(name);
}

operationCallback('Luan Vu', sayHello2);

// callback exp 2
//1st way
function doHomework1(subject1, callback3) {
  console.log(`I am studying ${subject1}.`);
  callback3();
}

doHomework1('English', function () {
  console.log('Done!');
});

//--2nd way
function doHomework2(subject2, callback4) {
  setTimeout(function () {
    console.log(`Studying ${subject2}.`);
    callback4();
  }, 1000);
}

const promise = new Promise((resolve, reject) => {});
