const form = document.querySelector('.student-form');
let fullnameInput = document.getElementById('fullname');
let emailInput = document.getElementById('email');
let phoneNumberInput = document.getElementById('phone-number');
let addressInput = document.getElementById('address');
let gender;
if (document.getElementById('male').checked) {
  gender = document.getElementById('male').value;
} else if (document.getElementById('female').checked) {
  gender = document.getElementById('female').value;
}
const checkFullName = () => {
  let valid = false;
  const fullnameTestString = fullnameInput.value;
  if (!isEmpty(fullnameTestString)) {
    showError(fullnameInput, 'Name cannot be blank');
  } else if (fullnameTestString.trim().length < 3) {
    showError(fullnameInput, 'Full name needs to be longer than 3 characters');
  } else {
    showSuccess(fullnameInput);
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  let valid = false;
  const emailTestString = emailInput.value.trim();
  if (!isEmpty(emailTestString)) {
    showError(emailInput, 'Email cannot be blank');
  } else if (!isEmailValid(emailTestString)) {
    showError(emailInput, 'Email is invalid');
  } else {
    showSuccess(emailInput);
    valid = true;
  }
};

const checkAddress = () => {
  let valid = false;
  const addressTestString = addressInput.value.trim();
  if (!isEmpty(addressTestString)) {
    showError(addressInput, 'Please enter your address');
  } else {
    showSuccess(addressInput);
    valid = true;
  }
};
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
  const phoneNumTestString = phoneNumberInput.value;
  if (!isEmpty(phoneNumTestString)) {
    showError(phoneNumberInput, 'Please enter your phone number');
  } else if (phoneNumTestString.trim().length > 10) {
    showError(phoneNumberInput, 'Phone number should have less than 10 digits');
  } else if (!isPhoneNumberCorrect(phoneNumTestString)) {
    showError(phoneNumberInput, 'Please enter number only');
  } else {
    showSuccess(phoneNumberInput);
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

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let isFullNameValid = checkFullName(),
    isEmailValid = checkEmail(),
    isPhoneNumCorrect = checkPhoneNumber(),
    isAddressCorrect = checkAddress(),
    isGenderValid = checkGender();
  let isFormValid =
    isFullNameValid && isEmailValid && isPhoneNumCorrect && isAddressCorrect && isGenderValid;
  if (isFormValid) {
  }
});

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
