const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const cvButton = document.querySelector('.cv-button');
const cvNote = document.querySelector('#cv-note');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

cvButton.addEventListener('click', () => {
  cvNote.classList.add('visible');
  cvNote.textContent = 'CV PDF will be available here soon.';
});

document.querySelector('#year').textContent = new Date().getFullYear();
