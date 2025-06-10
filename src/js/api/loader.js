// loader.js
const API_key = 'AIzaSyDenJrU1OnfLreiz4i6a7dyoBeSLK02F7Y';

export const loadGoogleMaps = (g = {}) => {
  return new Promise((resolve, reject) => {
    const p = 'The Google Maps JavaScript API';
    const c = 'google';
    const q = '__ib__';
    const m = document;
    const b = window;
    b[c] = b[c] || {};
    const d = b[c].maps || (b[c].maps = {});
    const e = new URLSearchParams(); // Створює параметри запиту для URL
    e.set('key', API_key); // Додає API ключ
    e.set('v', 'weekly'); // Встановлює версію API
    e.set('callback', c + '.maps.' + q); // Додає ім’я функції, яку викличе Google, коли скрипт буде завантажено. В даному випадку: google.maps.__ib__

    const script = m.createElement('script');
    script.src = `https://maps.${c}apis.com/maps/api/js?${e}`; // Формує URL для скрипта
    script.onerror = () => reject(Error(p + ' could not load.'));
    script.nonce = m.querySelector('script[nonce]')?.nonce || '';
    m.head.append(script); // Додає тег <script> до <head>, щоб браузер завантажив Google Maps API

    d[q] = resolve;
  });
};
