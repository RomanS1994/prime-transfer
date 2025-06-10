//map.js
// Завантаження Google Maps API динамічно
import { loadGoogleMaps } from '../api/loader.js';
// Функція, яка налаштовує інпут-поля адрес (Autocomplete, події)
import { setupInputs } from './inputs.js';
// Функція, яка налаштовує логіку маршрутів (побудова, відстань, час)
import { initRouting } from './route.js';
// Відновлює маркери, які були збережені в localStorage
import { restoreMarkers } from './markers.js';

// Головна функція — викликається з main.js
export async function initMap() {
  // 1. Завантажуємо скрипт Google Maps API
  await loadGoogleMaps();

  // 2. Імпортуємо потрібні частини Google Maps API (це асинхронно)
  const [
    { Map }, // Для створення самої карти
    { Marker }, // Для маркерів A і B
    { Autocomplete }, // Для підказок у полях вводу
    { DirectionsService, DirectionsRenderer, DistanceMatrixService }, // Для маршрутів
  ] = await Promise.all([
    google.maps.importLibrary('maps'),
    google.maps.importLibrary('marker'),
    google.maps.importLibrary('places'),
    google.maps.importLibrary('routes'),
  ]);

  // 3. Центр карти — Прага
  const defaultLocation = { lat: 50.0755, lng: 14.4378 };

  // 4. Створюємо саму карту та додаємо її в елемент з id="map"
  const map = new Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 13,
  });

  // 5. Формуємо об'єкт із усіма потрібними класами та картою
  const context = {
    map,
    Marker,
    Autocomplete,
    DirectionsService,
    DirectionsRenderer,
    DistanceMatrixService,
  };

  // 6. Ініціалізуємо інпути адрес (ввід, автозаповнення, клацання по карті)
  setupInputs(context);
  // 7. Ініціалізуємо сервіси маршрутів та обчислення відстані
  initRouting(context);
  // 8. Відновлюємо маркери та дані з LocalStorage, якщо користувач щось вводив раніше
  restoreMarkers(context);
}
