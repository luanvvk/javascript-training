function submitData() {
  let fullnameInput = document.getElementById('fullname');
  let emailInput = document.getElementById('email');
  let phoneNumberInput = document.getElementById('phone-number');
  let addressInput = document.getElementById('address');
  let gender = '';
  if (document.getElementById('male').checked) {
    gender = document.getElementById('male').value;
  } else if (document.getElementById('female').checked) {
    gender = document.getElementById('female').value;
  }
}
const checkFullName = () => {
  let valid = false;
  const fullnameTestString = fullnameInput.value;
  if (isEmpty(fullnameTestString)) {
    showError(fullnameInput, 'Name cannot be blank');
  } else if (fullnameTestString.trim().length < 3) {
    showError(fullnameInput, 'Full name needs be longer than 3 characters');
  } else {
    showSuccess(fullnameInput);
    valid = true;
  }
  return valid;
};
const isEmpty = (value) => (value === '' ? false : true);

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
  const error = formField.querySelector('span');
  error.textContent = '';
};
