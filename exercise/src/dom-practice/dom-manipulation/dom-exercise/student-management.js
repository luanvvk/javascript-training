let fullname = document.getElementById('fullname');
let email = document.getElementById('email');
let phone = document.getElementById('phone-number');
let address = document.getElementById('address');
const male = document.querySelector('#male');
const female = document.querySelector('#female');
let editingIndex = null;

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

let form = document.querySelector('.student-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  let isFullNameValid = checkFullName();
  let isEmailValid = checkEmail();
  let isPhoneNumCorrect = checkPhoneNumber();
  let isAddressCorrect = checkAddress();
  let isGenderValid = checkGender();

  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];
  function addStudent(fullname, email, phone, address, gender) {
    const student = {
      fullname: fullname.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      gender: gender,
    };
    students.push(student);
  }

  if (editingIndex !== null) {
    students[editingIndex] = { fullname, email, phone, address, gender };
    editingIndex = null;
  } else {
    addStudent(fullname, email, phone, address, gender);
  }

  localStorage.setItem('students', JSON.stringify(students));
  renderStudentList();

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
function renderStudentList() {
  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];
  if (students.length === 0) {
    document.getElementById('student-list').style.display = 'none';
    return false;
  }
  document.getElementById('student-list').style.display = 'block';
  let tableContent = `<tr>
          <th>Number</th>
          <th>Student's name</th>
          <th>Student's email</th>
          <th>Gender</th>
          <th>Phone number</th>
          <th>Address</th>
          <th>Action</th>
        </tr>`;
  students.forEach((student, index) => {
    let studentId = index;
    index++;
    let genderLabel = parseInt(student.gender) === 1 ? 'Male' : 'Female';
    tableContent += `<tr>
                <td>${index}</td>
                <td>${student.fullname}</td>
                <td>${student.email}</td>
                <td>${genderLabel}</td>
                <td>${student.phone}</td>
                <td>${student.address}</td>
                <td>
                    <a href ="javascript:void(0)" onclick="editStudent(${studentId})">Edit</a> |
                    <a href ="javascript:void(0)" onclick="deleteStudent(${studentId})">Delete</a>
                </td>
              </tr>`;
  });
  document.getElementById('students-grids').innerHTML = tableContent;
  form.reset();
}
function deleteStudent(id) {
  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];
  students.splice(id, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudentList();
}

function editStudent(index) {
  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];
  const student = students[index];
  document.getElementById('fullname').value = student.fullname;
  document.getElementById('email').value = student.email;
  document.getElementById('phone-number').value = student.phone;
  document.getElementById('address').value = student.address;
  document.querySelector('button[type=submit]').innerText = 'Save';
  editingIndex = index;

  localStorage.setItem('students', JSON.stringify(students));
}
