const STORAGE_KEY = 'form-data';

// Зберігає адресу та координати. НЕ перезаписує старі значення, якщо нових немає
export function saveFormToLS({ fromAddress, toAddress, fromCoords, toCoords }) {
  const prev = loadFormFromLS(); // попередні дані

  const data = {
    ...prev,
    ...(fromAddress && { 'get-in': fromAddress }),
    ...(toAddress && { 'get-out': toAddress }),
    ...(fromCoords && { 'get-in-coords': fromCoords }),
    ...(toCoords && { 'get-out-coords': toCoords }),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Отримуємо повністю збережений об'єкт форми
export function loadFormFromLS() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

// Універсальні функції (можуть використовуватись для інших цілей)
export function loadLs(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function saveLs(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
