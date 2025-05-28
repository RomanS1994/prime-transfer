import { modalDescriptions as ua } from './modalDescriptions/ua.js';
import { modalDescriptions as en } from './modalDescriptions/en.js';
import { modalDescriptions as cs } from './modalDescriptions/cz.js';

const lang = document.documentElement.lang || 'ua'; // або з localStorage
console.log(lang);

const descriptionsByLang = {
  ua,
  en,
  cs,
};

export const modalDescriptions = descriptionsByLang[lang] || en;
