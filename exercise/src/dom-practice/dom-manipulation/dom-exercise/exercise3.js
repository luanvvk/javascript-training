const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');

const form = document.querySelector('#signup');

const checkUsername = () => {
  let valid = false;

  const usernameTestString = usernameInput.value;

  if (!isEmpty(usernameTestString)) {
    showError(usernameInput, 'Username cannot be blank.');
  } else if (usernameTestString.includes(' ')) {
    showError(
      usernameInput,
      `Please enter the correct format for Username, no leading or trailing spaces`,
    );
  } else {
    showSuccess(usernameInput);
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  let valid = false;
  const emailTestString = emailInput.value.trim();
  if (!isEmpty(emailTestString)) {
    showError(emailInput, 'Email cannot be blank.');
  } else if (!isEmailValid(emailTestString)) {
    showError(emailInput, 'Email is not valid.');
  } else {
    showSuccess(emailInput);
    valid = true;
  }
  return valid;
};

const checkPassword = () => {
  let valid = false;

  const passwordTestString = passwordInput.value.trim();

  if (!isEmpty(passwordTestString)) {
    showError(passwordInput, 'Password cannot be blank.');
  } else if (!isPasswordSecure(passwordTestString)) {
    showError(
      passwordInput,
      'Please enter the correct format for password (8 characters at least one non-letter',
    );
  } else {
    showSuccess(passwordInput);
    valid = true;
  }

  return valid;
};

const checkConfirmPassword = () => {
  let valid = false;
  const confirmPasswordTestString = confirmPasswordInput.value.trim();
  const passwordTestString = passwordInput.value.trim();

  if (!isEmpty(confirmPasswordTestString)) {
    showError(
      confirmPasswordInput,
      'Please enter the correct format for confirm password (8 characters at least one non-letter',
    );
  } else if (passwordTestString !== confirmPasswordTestString) {
    showError(confirmPasswordInput, 'The password does not match');
  } else {
    showSuccess(confirmPasswordInput);
    valid = true;
  }

  return valid;
};
//conditions
const isEmpty = (value) => (value === '' ? false : true);

const isEmailValid = (emailTestString) => {
  const re = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
  return re.test(emailTestString);
};

const isPasswordSecure = (passwordTestString) => {
  const re = new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
  return re.test(passwordTestString);
};
//Status
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

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let isUsernameValid = checkUsername(),
    isEmailValid = checkEmail(),
    isPasswordValid = checkPassword(),
    isConfirmPasswordValid = checkConfirmPassword();

  let isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
  if (isFormValid) {
  }
});

function showDetail() {
  const text = document.createElement('p');
  const pText = document.createTextNode(
    'Email:' +
      emailInput.value +
      '\n' +
      'Username:' +
      usernameInput.value +
      '\n' +
      'Password: ' +
      passwordInput.value +
      '\n' +
      'Confirm Password: ' +
      confirmPasswordInput.value,
  );
  text.appendChild(pText);
  form.appendChild(text);
}

form.addEventListener('input', function (e) {
  switch (e.target.id) {
    case 'username':
      checkUsername();
      break;
    case 'email':
      checkEmail();
      break;
    case 'password':
      checkPassword();
      break;
    case 'confirm-password':
      checkConfirmPassword();
      break;
  }
});
function resetForm() {
  form.reset();
  const formField = document.getElementsByClassName('form-field');
  for (let i = 0; i < formField.length; i++) {
    formField[i].classList.remove('error');
  }
}
