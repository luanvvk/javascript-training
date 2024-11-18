const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let i = 0;
while (i < a.length) {
  console.log(a[i]);
  console.log(i);
  i++;
  if (i >= 5) break;
}

var myCar = ['Ford', 'Honda', 'Toyota', 'Audi', 'BMW'];
let b = 0;
do {
  console.log(myCar[b]);
  b++;
  if (b > 4) break;
} while (b < myCar.length);

for (let c = 0; c < myCar.length; c++) {
  if (c > 2) {
    console.log(myCar[c]);
  } else {
    console.log(-1);
  }
}

for (const value of myCar) {
  console.log(value);
}
