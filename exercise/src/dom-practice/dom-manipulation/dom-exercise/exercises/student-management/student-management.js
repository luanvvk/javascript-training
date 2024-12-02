//Add student
let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
function addStudent(fullname, email, phone, address, gender) {
  const student = {
    fullname: fullname.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    gender,
  };
  students.push(student);
}
//Render student data
function renderStudentList() {
  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];
  if (students.length === 0) {
    document.getElementById('student-list').style.display = 'none';
    return false;
  }
  document.getElementById('student-list').style.display = 'block';
  const tableContent = document.getElementById('data-list');
  tableContent.innerHTML = '';
  students.forEach((student, index) => {
    let genderLabel = parseInt(student.gender) === 1 ? 'Male' : 'Female';

    const row = `<tr >
                <td>${index + 1}</td> 
                <td>${student.fullname}</td>
                <td>${student.email}</td>
                <td>${genderLabel}</td>
                <td>${student.phone}</td>
                <td>${student.address}</td>
                <td>
                    <a href ="javascript:void(0)" onclick="editStudent(${index})">Edit</a> |
                    <a href ="javascript:void(0)" onclick="deleteStudent(${index})">Delete</a>
                </td>
              </tr>`;
    tableContent.innerHTML += row;
  });

  form.reset();
}
//Handle main event which contains add/edit function

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
  if (currentIndex == -1) {
    addStudent(fullname, email, phone, address, gender);
  } else {
    students[currentIndex] = {
      fullname: fullname.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      gender,
    };
    currentIndex = -1;
    document.querySelector('button[type="submit"]').innerHTML = 'Submit';
  }
  localStorage.setItem('students', JSON.stringify(students));
  renderStudentList();
});

//Delete student
function deleteStudent(id) {
  let students = localStorage.getItem('students')
    ? JSON.parse(localStorage.getItem('students'))
    : [];

  students.splice(id, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudentList();
}
//Edit student
let currentIndex = -1;
function editStudent(index) {
  const student = students[index];
  document.getElementById('fullname').value = student.fullname;
  document.getElementById('email').value = student.email;
  document.getElementById('phone-number').value = student.phone;
  document.getElementById('address').value = student.address;
  document.querySelector('button[type="submit"]').innerHTML = 'Save';
  currentIndex = index;
}
