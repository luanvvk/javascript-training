const menuIcon = document.querySelector('.mobile-menu-icon');
const navMenu = document.querySelector('.nav-menu');
const overLay = document.querySelector('.overlay');
menuIcon.addEventListener('click', mobileMenu);

function mobileMenu() {
  menuIcon.classList.toggle('active');
  navMenu.classList.toggle('active');
  overLay.classList.toggle('active');
}

const navLink = document.querySelectorAll('.nav-link');

navLink.forEach((event) => event.addEventListener('click', closeMenu));

function closeMenu() {
  menuIcon.classList.toggle('active');
  navMenu.classList.toggle('active');
}
