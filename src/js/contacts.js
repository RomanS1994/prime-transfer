import emailjs from '@emailjs/browser';
emailjs.init('OSo8LZCAina66hnWn'); // твій актуальний публічний ключ

import { uploadTransferPdf } from './firebase/uploadPdf.js';

import { buildAndSendData } from './send.js';
import { clearMarkers } from './map/inputs.js';
import { clearRoute } from './map/route.js';

const refs = {
  form: document.querySelector('form'),
  button: document.querySelector('.submit-button'),
};

const { form, button } = refs;

const colorBackground = '#fcfaf2';
const colorBorder = '2px solid #ff9662';
let data = {};
const keyLS = 'form-data';

// Зміна кольору
function changeBgColor(el, currentColor = colorBackground) {
  el.style.background = currentColor;
}

// Зміна бордеру
function changeBorderColor(el, currentColor = colorBorder) {
  el.style.border = currentColor;
}

// Збереження LS
function saveLs(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Отримання даних LS
function loadLs(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Відновлюємо збережені значення
const lsData = loadLs(keyLS);
if (lsData) {
  Object.entries(lsData).forEach(([name, value]) => {
    const input = document.querySelector(`.form-input[name="${name}"]`);
    if (input) {
      input.value = value;
      changeBgColor(input);
      data[name] = value;
    }
  });
}

// Слухаємо зміни значення інпутів
form.addEventListener('input', event => {
  const input = event.target;
  if (!input.classList.contains('form-input')) return;

  const { name, value } = input;

  if (value.trim()) {
    data[name] = value;
    changeBgColor(input);
    changeBorderColor(input, '1px solid #ded47b');
  } else {
    delete data[name];
    changeBorderColor(input, colorBorder);
    changeBgColor(input, '#FFF');
  }

  // зберігаємо обʼєднані дані (форма + координати маршруту, якщо вже є)
  const prev = loadLs(keyLS) || {};
  const merged = { ...prev, ...data };
  saveLs(keyLS, merged);
});

// Сабмітимо форму
button.addEventListener('click', handlerSubmit);

async function handlerSubmit(e) {
  console.log('📩 handlerSubmit запускається');
  e.preventDefault();

  const inputs = form.querySelectorAll('.form-input');
  const allFilled = [...inputs].every(input => input.value.trim());
  if (!allFilled) {
    alert('Заповніть всі дані у формі!');
    return;
  }

  // ✅ Створюємо об'єднаний об'єкт даних
  const payload = buildAndSendData();
  console.log('📦 Payload:', payload);

  // // 📎 Генеруємо PDF і завантажуємо на Firebase
  // try {
  //   const pdfUrl = await uploadTransferPdf(payload);
  //   payload.pdfUrl = pdfUrl; // 🔗 додаємо в об'єкт
  //   console.log('✅ PDF uploaded:', pdfUrl);
  // } catch (error) {
  //   console.error('❌ Помилка завантаження PDF:', error);
  //   alert('Не вдалося завантажити PDF. Спробуйте ще раз.');
  //   return;
  // }

  // ✉️ Відправляємо Email через EmailJS
  const SERVICE_ID = 'service_2jgokst';
  const TEMPLATE_ID = 'template_rq2x55a';
  emailjs.send(SERVICE_ID, TEMPLATE_ID, payload).then(
    function (response) {
      console.log('✅ Email sent:', response);
      alert('Дані успішно надіслано на email!');
    },
    function (error) {
      console.error('❌ Email send error:', JSON.stringify(error, null, 2));
      alert('Помилка надсилання email!');
    }
  );

  console.log('📦 Дані відправлені:', payload);

  // 🧹 Очищення
  localStorage.removeItem(keyLS);
  localStorage.removeItem('route-data');
  clearMarkers();
  clearRoute();

  inputs.forEach(el => {
    el.value = '';
    changeBgColor(el, 'var(--white)');
  });

  data = {};

  alert('Форма успішно відправлена ✅');
}

console.log(localStorage.getItem(keyLS));
