let fullname = document.getElementById('fullname');
let email = document.getElementById('email');
let phone = document.getElementById('phone-number');
let address = document.getElementById('address');
const male = document.querySelector('#male');
const female = document.querySelector('#female');

const checkFullName = () => {
  let valid = false;
  const fullnameTestString = fullname.value;
  if (!isEmpty(fullnameTestString)) {
    showError(fullname, 'Name cannot be blank');
  } else if (fullnameTestString.trim().length < 3) {
    showError(fullname, 'Full name needs to be longer than 3 characters');
  } else {
    showSuccess(fullname);
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  let valid = false;
  const emailTestString = email.value.trim();
  if (!isEmpty(emailTestString)) {
    showError(email, 'Email cannot be blank');
  } else if (!isEmailValid(emailTestString)) {
    showError(email, 'Email is invalid');
  } else {
    showSuccess(email);
    valid = true;
  }
};

const checkAddress = () => {
  let valid = false;
  const addressTestString = address.value.trim();
  if (!isEmpty(addressTestString)) {
    showError(address, 'Please enter your address');
  } else {
    showSuccess(address);
    valid = true;
  }
};

let gender = '';
function setValue1() {
  male.value = 1;
  gender = male.value;
}
function setValue2() {
  female.value = 2;
  gender = female.value;
}
const checkGender = () => {
  let valid = false;

  if (gender === '') {
    document.querySelector('#gender-error').innerHTML = 'Please identify your gender';
  } else {
    document.querySelector('#gender-error').innerHTML = '';
    valid = true;
  }
};

const checkPhoneNumber = () => {
  let valid = false;
  const phoneNumTestString = phone.value;
  if (!isEmpty(phoneNumTestString)) {
    showError(phone, 'Please enter your phone number');
  } else if (phoneNumTestString.trim().length > 10) {
    showError(phone, 'Phone number should have less than 10 digits');
  } else if (!isPhoneNumberCorrect(phoneNumTestString)) {
    showError(phone, 'Please enter number only');
  } else {
    showSuccess(phone);
    valid = true;
  }
};

const isEmpty = (value) => (value === '' ? false : true);
const isEmailValid = (emailTestString) => {
  const testString = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
  return testString.test(emailTestString);
};
const isPhoneNumberCorrect = (phoneNumTestString) => {
  const testString = /^[0-9]+$/;
  return testString.test(phoneNumTestString);
};
const showError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove('success');
  formField.classList.add('error');
  const error = formField.querySelector('span');
  error.textContent = message;
};

const showSuccess = (input) => {
  const formField = input.parentElement;
  formField.classList.remove('error');
  formField.classList.add('success');
  const success = formField.querySelector('span');
  success.textContent = '';
};

let form = document.getElementById('form');
form.addEventListener('input', function (e) {
  switch (e.target.id) {
    case 'fullname':
      checkFullName();
      break;
    case 'email':
      checkEmail();
      break;
    case 'address':
      checkAddress();
      break;
    case 'phone-number':
      checkPhoneNumber();
      break;
    case 'male':
      checkGender();
      break;
    case 'female':
      checkGender();
      break;
  }
});
