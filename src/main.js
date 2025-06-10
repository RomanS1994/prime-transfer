// main.js
// Імпортуємо різні частини інтерфейсу (модальні вікна, контакти, годинник)
import './js/contacts.js';
import './js/about.js';
import './js/dateTime.js';
import './js/modals.js';
// import './js/map1.js';
// Імпортуємо головну функцію, яка створює карту та підключає всі інші модулі
import { initMap } from './js/map/map.js';

// Запускаємо карту — саме з цього моменту все починає працювати
initMap();
