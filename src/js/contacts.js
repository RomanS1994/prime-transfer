const refs = {
  form: document.querySelector('form'),
};

const { form } = refs;

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

// збереження LS
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

  if (!input.classList.contains('form-input')) return; // фільтр

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

  saveLs(keyLS, data);
  console.log(data);
});

// Сабмітимо форму
form.addEventListener('submit', handlerSubmit);

function handlerSubmit(e) {
  e.preventDefault();
  const objLength = Object.keys(data).length;
  if (objLength != 6) {
    alert('Зповніть всі дані у таблиці !');
    return;
  } else {
    localStorage.removeItem(keyLS);
    console.log(`Дані відправлені - ${data}`);
    console.log(data);

    Array.from(form.elements).forEach(el => {
      if (el.classList.contains('form-input')) {
        changeBgColor(el, 'var(--white)');
      }
    });

    alert('Форма успішно відправлена ✅');
  }
  form.reset();
}
