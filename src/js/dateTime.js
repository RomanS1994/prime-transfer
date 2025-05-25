import flatpickr from 'flatpickr';
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js';
import { Czech } from 'flatpickr/dist/l10n/cs.js';
import { Russian } from 'flatpickr/dist/l10n/ru.js';

const locales = {
  uk: Ukrainian,
  cs: Czech,
  ru: Russian,
};

const userLang = navigator.language || navigator.userLanguage;
const langCode = userLang.split('-')[0]; // отримуємо, наприклад, "uk"

const selectedLocale = locales[langCode] || 'default'; // default = англійська

const fp = flatpickr(document.querySelector('.input-date-time'), {
  locale: selectedLocale,
  enableTime: true,
  time_24hr: true, // показує 24-годинний формат (без AM/PM)
  // altInput: true,
  altFormat: 'd.m.Y H:i', // приклад: 24.05.2025 14:30
  dateFormat: 'Y-m-d H:i', // формат, який зберігається у value
  minDate: 'today',
  position: 'above',
});
