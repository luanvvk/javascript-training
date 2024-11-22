//Promises
//assume case resolve only
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

// Promise executes even before then() method

const promise1 = new Promise((resolve, reject) => {
  console.log('Executing promise1');
  resolve('Success');
});

promise1.then((result) => {
  console.log('Promise resolved1', result);
});

console.log('Promise created1');

//Delay Promise until then() method starts
const promiseFunc = () =>
  new Promise((resolve, reject) => {
    console.log('Executing promise2');
    resolve('Success');
  });

// promiseFunc().then((result) => {
//   console.log('Promise resolved2:', result);
// });

console.log('Promise created2');

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

//use async/await to handle error

const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Error spotted'));
    }, 2000);
  });
};
const getUser = async () => {
  try {
    const value = await getData();
    console.log(value);
  } catch (err) {
    console.log(err);
    return null;
  }
};
getUser().then((value) => {
  console.log(value);
});
// example 2:
function avoidTax(a1, a2) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Tax evasion spotted. Need to pay now'));
    }, 2000);
  });
}
async function payTax(amountPaid, amountNeedstoPay) {
  let taxAmount;
  try {
    taxAmount = await avoidTax(amountPaid, amountNeedstoPay);
  } catch (error) {
    console.log(`${error.message}`);
    taxAmount = amountPaid + amountNeedstoPay;
  }
  console.log(`Total amount needs to pay: ${taxAmount}`);
  return taxAmount;
}

payTax(1000, 2000);
