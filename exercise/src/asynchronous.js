//callbacks
const functionCallback = (name) => {
  console.log(`Hello ${name}`);
};
function operationCallback(name, callback) {
  callback(name);
}
operationCallback('Luan Vu', functionCallback);

//Promises
const promise = function operationCallback(name) {
  return new Promise((resolve, reject) => {
    resolve(name);
  });
};
promise('Luan Vu').then((name) => console.log(`Hello ${name}`));

//------------

const myPromise = new Promise((resolve, reject) => {
  let condition = true;
  if (condition) {
    setTimeout(() => {
      resolve('Success');
    }, 3000);
  } else {
    reject('Error');
  }
});
myPromise
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log('Done');
  });

//Priority

Promise.resolve().then(() => {
  console.log('1');
});

setTimeout(() => {
  console.log('2');
}, 10);

queueMicrotask(() => {
  console.log('3');
  queueMicrotask(() => {
    console.log('4');
  });
});

console.log('5');

///async-await
//calculate new price after tax

function getActualPrice(n1, n2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(n1 + n2);
    }, 1000);
  });
}

async function calcPrice(basePrice, tax) {
  const actualPrice = await getActualPrice(basePrice, tax);
  console.log(`Actual price ${actualPrice}`);
  return actualPrice;
}
calcPrice(1000, 100);
