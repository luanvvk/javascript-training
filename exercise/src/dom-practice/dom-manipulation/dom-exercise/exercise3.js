const usernameEl = document.querySelector('#username');
const emailEl = document.querySelector('#email');
const passwordEl = document.querySelector('#password');
const confirmPasswordEl = document.querySelector('#confirm-password');

const form = document.querySelector('#signup');

const checkUsername = () => {
  let valid = false;

  const username = usernameEl.value.trim();

  if (!isRequired(username)) {
    showError(usernameEl, 'Username cannot be blank.');
  } else if (isNameCorrect(username)) {
    showError(
      usernameEl,
      `Please enter the correct format for Username, no leading or trailing spaces`,
    );
  } else {
    showSuccess(usernameEl);
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  let valid = false;
  const email = emailEl.value.trim();
  if (!isRequired(email)) {
    showError(emailEl, 'Email cannot be blank.');
  } else if (!isEmailValid(email)) {
    showError(emailEl, 'Email is not valid.');
  } else {
    showSuccess(emailEl);
    valid = true;
  }
  return valid;
};

const checkPassword = () => {
  let valid = false;

  const password = passwordEl.value.trim();

  if (!isRequired(password)) {
    showError(passwordEl, 'Password cannot be blank.');
  } else if (!isPasswordSecure(password)) {
    showError(
      passwordEl,
      'Please enter the correct format for password (8 characters at least one non-letter',
    );
  } else {
    showSuccess(passwordEl);
    valid = true;
  }

  return valid;
};

const checkConfirmPassword = () => {
  let valid = false;
  const confirmPassword = confirmPasswordEl.value.trim();
  const password = passwordEl.value.trim();

  if (!isRequired(confirmPassword)) {
    showError(
      confirmPasswordEl,
      'Please enter the correct format for confirm password (8 characters at least one non-letter',
    );
  } else if (password !== confirmPassword) {
    showError(confirmPasswordEl, 'The password does not match');
  } else {
    showSuccess(confirmPasswordEl);
    valid = true;
  }

  return valid;
};

const isEmailValid = (email) => {
  const re = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
  return re.test(email);
};

const isPasswordSecure = (password) => {
  const re = new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
  return re.test(password);
};
const isNameCorrect = (username) => {
  const re = new RegExp('^(S+(?: S+)*$)');
  return re.test(username);
};
const isRequired = (value) => (value === '' ? false : true);

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
      emailEl.value +
      '\n' +
      'Username:' +
      usernameEl.value +
      '\n' +
      'Password: ' +
      passwordEl.value +
      '\n' +
      'Confirm Password: ' +
      confirmPasswordEl.value,
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
}
