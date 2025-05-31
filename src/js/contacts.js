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
    changeBgColor(input, '#fcfaf2'); // Або var(--secondary-accent-color) з CSS
    changeBorderColor(input, '1px solid #ded47b');
  } else {
    delete data[name];
    changeBorderColor(input, colorBorder);
    changeBgColor(input, '#FFF');
  }

  // Обʼєднуємо нові дані з попередніми з LS
  const prev = loadLs(keyLS) || {};
  const merged = { ...prev, ...data };
  saveLs(keyLS, merged);
});

// Сабмітимо форму
button.addEventListener('click', handlerSubmit);

function handlerSubmit(e) {
  e.preventDefault();

  const objLength = Object.keys(data).length;
  if (objLength !== 6) {
    alert('Заповніть всі дані у таблиці!');
    return;
  }

  const saved = loadLs(keyLS) || {};

  // 🛑 Перевіряємо, чи є координати маршруту
  if (!saved['get-in-coords'] || !saved['get-out-coords']) {
    alert(
      'Будь ласка, оберіть коректні адреси для маршруту на мапі або через підказки.'
    );
    return;
  }

  // ✅ Якщо все гаразд — очищаємо LS
  localStorage.removeItem(keyLS);

  console.log('Дані відправлені:', data);

  // Очищення полів форми
  Array.from(form.elements).forEach(el => {
    if (el.classList.contains('form-input')) {
      el.value = '';
      changeBgColor(el, 'var(--white)');
    }
  });

  data = {}; // Очищуємо обʼєкт форми

  alert('Форма успішно відправлена ✅');
}
