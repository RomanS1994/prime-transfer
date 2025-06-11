// main.js
// Імпортуємо різні частини інтерфейсу (модальні вікна, контакти, годинник)
import './js/contacts.js';
import './js/about.js';
import './js/dateTime.js';
import './js/modals.js';
import './js/errorWindow/displayWorkInProgress.js';

// import './js/map1.js';
// Імпортуємо головну функцію, яка створює карту та підключає всі інші модулі
import { initMap } from './js/map/map.js';

// Запускаємо карту — саме з цього моменту все починає працювати
initMap();

let lastScrollTop = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;

  if (scrollTop > lastScrollTop) {
    // Користувач скролить вниз — ховаємо хедер
    header.style.transform = 'translateY(-100%)';
  } else {
    // Користувач скролить вгору — показуємо хедер
    header.style.transform = 'translateY(0)';
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
