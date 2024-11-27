const usernameEl = document.querySelector('#username');
const emailEl = document.querySelector('#email');
const passwordEl = document.querySelector('#password');
const confirmPasswordEl = document.querySelector('#confirm-password');

const form = document.querySelector('#signup');

const checkUsername = () => {
  let valid = false;
  if (!isRequired(username)) {
    showError(userName, 'Username cannot be blank');
  } else if (/^\s+.*/.test(username) && /.*\s+$/.test(username) && /.*\s{2,}.*/.test(username)) {
    showError(
      userName,
      'Please enter the correct format for Username (No leading or trailing spaces)',
    );
  } else {
    showSuccess(userName);
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  let valid = false;
  if (!isRequired(email)) {
    showError(emailEl, 'Email cannot be blank');
  } else {
    showSuccess(emailEl);
    valid = true;
  }
  return valid;
};

const checkPassword = () => {
  let valid = false;
  if (!isRequired(password)) {
    showError(passwordEl, 'Password cannot be blank');
  } else if (!isPasswordSecured(password)) {
    showError(
      passwordEl,
      'Please enter the correct format for password, (8 characters at least one non-letter)',
    );
  } else {
    showSuccess(passwordEl);
    valid = true;
  }
  return valid;
};
const checkConfirmPassword = () => {
  let valid = false;
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

const isRequired = (value) => (value === '' ? false : true);

const isPasswordSecured = (password) => {
  const re = new RegExp('^(?=.*?[#?!@$%^&*-])(?=.*?[0-9])(?=.{8,})');
  return re.test(password);
};

const input = document.getElementsByTagName('input');
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
  let isUserNameValid = checkUsername(),
    isEmailValid = checkEmail(),
    isPasswordValid = checkPassword(),
    isConfirmPasswordValid = checkConfirmPassword();
  let isFormValid = isUserNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
  if (isFormValid) {
  }
});

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
