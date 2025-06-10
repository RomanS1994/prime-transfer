//inputs.js

import { setFromPlace, setToPlace } from './route.js'; // для запуску побудови маршруту
import { saveFormToLS } from '../storage/localStorage.js'; // для збереження даних у браузері

let fromInput, toInput; // поля вводу адрес
let fromAutocomplete, toAutocomplete; // підказки адрес
let manualFromMarker, manualToMarker; // маркери на мапі (ручне ставлення)
let isSettingFrom = true; // який маркер ставимо: A (true) або B (false)
let mapRef, MarkerRef; // посилання на мапу та конструктор маркерів

let isAutocompleteUsed = false;

//setupInputs(...) — головна функція
export function setupInputs({ map, Marker, Autocomplete }) {
  // Зберігаємо об'єкти мапи та маркера
  mapRef = map;
  MarkerRef = Marker;

  // Отримуємо DOM-елементи інпутів
  fromInput = document.getElementById('get-in');
  toInput = document.getElementById('get-out');

  // Підключаємо підказки до інпутів (Autocomplete)
  fromAutocomplete = new Autocomplete(fromInput, {
    types: ['geocode'],
    componentRestrictions: { country: 'cz' },
  });

  toAutocomplete = new Autocomplete(toInput, {
    types: ['geocode'],
    componentRestrictions: { country: 'cz' },
  });

  // Коли користувач вибрав адресу "звідки"
  fromAutocomplete.addListener('place_changed', () => {
    isAutocompleteUsed = true; // ⚠️ вказуємо, що була підказка
    const place = fromAutocomplete.getPlace();
    if (!place.geometry?.location) return;

    setFrom(place);
  });

  // Коли вибрав адресу "куди"
  toAutocomplete.addListener('place_changed', () => {
    isAutocompleteUsed = true; // ⚠️ вказуємо, що була підказка
    const place = toAutocomplete.getPlace();
    if (!place.geometry?.location) return;

    setTo(place);
  });

  // Якщо користувач клікнув на мапу — викликаємо обробку
  map.addListener('click', onMapClick);

  // Налаштовуємо кнопки для вибору точок на мапі
  setupButtons();
}

// 📍 setFrom(place) — ставить маркер "A", зберігає адресу й координати
export function setFrom(place) {
  // Якщо маркер вже був — видаляємо
  if (manualFromMarker) manualFromMarker.setMap(null);

  // Ставимо новий маркер
  manualFromMarker = new MarkerRef({
    position: place.geometry.location,
    map: mapRef,
    label: 'A',
  });

  // Встановлюємо адресу в поле
  fromInput.value = place.formatted_address || place.name || '';

  // Зберігаємо точку в модуль route.js і в localStorage
  setFromPlace(place);
  saveFormToLS({
    fromAddress: fromInput.value,
    toAddress: toInput.value,
    fromCoords: place.geometry.location.toJSON(),
    toCoords: manualToMarker?.getPosition()?.toJSON() || null,
  });
}

//📍 setTo(place) — ставить маркер "B", зберігає адресу й координати
export function setTo(place) {
  // Якщо маркер вже був — видаляємо
  if (manualToMarker) manualToMarker.setMap(null);

  // Ставимо новий маркер
  manualToMarker = new MarkerRef({
    position: place.geometry.location,
    map: mapRef,
    label: 'B',
  });
  // Встановлюємо адресу в поле
  toInput.value = place.formatted_address || place.name || '';

  //  Зберігаємо точку в модуль route.js і в localStorage
  setToPlace(place);
  saveFormToLS({
    fromAddress: fromInput.value,
    toAddress: toInput.value,
    fromCoords: manualFromMarker?.getPosition()?.toJSON() || null,
    toCoords: place.geometry.location.toJSON(),
  });
}

// Коли користувач клацає по мапі — викликається геокодування точки
function onMapClick(e) {
  const geocoder = new google.maps.Geocoder(); // створюємо геокодер

  // перетворюємо координати в адресу
  geocoder.geocode({ location: e.latLng }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const place = {
        geometry: { location: e.latLng }, // координати
        formatted_address: results[0].formatted_address, // адреса
      };

      // якщо зараз обираємо "звідки" — ставимо A, інакше B
      if (isSettingFrom) {
        setFrom(place);
      } else {
        setTo(place);
      }
    }
  });
}

// Перетворює введену адресу в координати, якщо користувач ввів текст вручну
function geocodeAddress(input, isFrom) {
  const address = input.value.trim(); // беремо значення з поля
  if (!address) return; // якщо пусто — нічого не робимо

  const geocoder = new google.maps.Geocoder(); // створюємо геокодер

  // шукаємо координати для введеної адреси
  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location;

      const place = {
        geometry: { location },
        formatted_address: results[0].formatted_address,
      };

      // якщо це поле "звідки" — ставимо A, інакше B
      isFrom ? setFrom(place) : setTo(place);
    } else {
      // Якщо не вдалося знайти адресу — показуємо помилку
      alert('❌ Невірна адреса. Виберіть із підказок або з карти.');
      input.value = ''; // очищаємо поле

      // видаляємо маркер, якщо він був
      if (isFrom && manualFromMarker) manualFromMarker.setMap(null);
      if (!isFrom && manualToMarker) manualToMarker.setMap(null);

      // зберігаємо очищені дані в LocalStorage
      saveFormToLS({
        fromAddress: fromInput.value,
        toAddress: toInput.value,
        fromCoords: manualFromMarker?.getPosition()?.toJSON() || null,
        toCoords: manualToMarker?.getPosition()?.toJSON() || null,
      });
    }
  });
}

// Налаштовує кнопки вибору адреси на мапі (ручне ставлення маркера)
function setupButtons() {
  const fromBtn = document.getElementById('set-from-btn');
  const toBtn = document.getElementById('set-to-btn');

  // Коли натиснули “обрати точку посадки” — вмикаємо режим вибору A
  fromBtn?.addEventListener('click', () => {
    isSettingFrom = true;
    enableCursorPickMode();
    alert('👉 Натисніть на карту, щоб обрати точку посадки (Маркер A)');
  });

  // Коли натиснули “обрати точку висадки” — вмикаємо режим вибору B
  toBtn?.addEventListener('click', () => {
    isSettingFrom = false;
    enableCursorPickMode();
    alert('👉 Натисніть на карту, щоб обрати точку висадки (Маркер B)');
  });
}

// Додає клас до мапи, щоб візуально показати режим вибору точки
function enableCursorPickMode() {
  document.getElementById('map')?.classList.add('map-pick-mode');
}

// функція очищення маркерів
export function clearMarkers() {
  if (manualFromMarker) {
    manualFromMarker.setMap(null);
    manualFromMarker = null;
  }

  if (manualToMarker) {
    manualToMarker.setMap(null);
    manualToMarker = null;
  }

  // очистимо поля вводу (опційно)
  fromInput.value = '';
  toInput.value = '';
}
