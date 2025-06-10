import { loadLs } from './storage/localStorage.js';

// Функція формує фінальний об'єкт для надсилання
export function buildAndSendData() {
  const formData = loadLs('form-data') || {};

  const fromCoords = formData['get-in-coords']
    ? `https://maps.google.com?q=${formData['get-in-coords'].lat},${formData['get-in-coords'].lng}`
    : '';

  const toCoords = formData['get-out-coords']
    ? `https://maps.google.com?q=${formData['get-out-coords'].lat},${formData['get-out-coords'].lng}`
    : '';

  const payload = {
    'user-name': formData['user-name'] || '',
    'user-email': formData['user-email'] || '',
    'user-phone': formData['user-phone'] || '',
    time: formData['time'] || '',
    from: formData['get-in'] || '',
    to: formData['get-out'] || '',
    fromCoords,
    toCoords,
  };

  return payload;
}
