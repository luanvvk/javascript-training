let form = document.querySelector('.student-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  let isFullNameValid = checkFullName();
  let isEmailValid = checkEmail();
  let isPhoneNumCorrect = checkPhoneNumber();
  let isAddressCorrect = checkAddress();
  let isGenderValid = checkGender();

  let isFormValid =
    isFullNameValid && isEmailValid && isPhoneNumCorrect && isAddressCorrect && isGenderValid;
  if (isFormValid) {
  }

  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];

  const student = {
    fullname: fullname.value,
    email: email.value,
    phone: phone.value,
    address: address.value,

    gender: gender,
  };
  students.push(student);
  if (currentIndex !== -1) {
    students[currentIndex] = student;
    currentIndex = -1;
    document.querySelector('button[type="submit"]').innerHTML = 'Submit';
  } else {
    renderStudentList(student);
  }

  localStorage.setItem('students', JSON.stringify(students));
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

    tableContent += `<tr id="data-list">
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
  document.getElementById('student-grids').innerHTML = tableContent;
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
let currentIndex = -1;
function editStudent(index) {
  currentIndex = index;
  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];
  const student = students[index];
  document.getElementById('fullname').value = student.fullname;
  document.getElementById('email').value = student.email;
  document.getElementById('phone-number').value = student.phone;
  document.getElementById('address').value = student.address;
  document.querySelector('button[type="submit"]').innerHTML = 'Save';
}
