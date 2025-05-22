const refs = {
  form: document.querySelector('form'),
  button: document.querySelector('.submit-button'),
};

const { form, button } = refs;

const colorBackground = '#FFFDEB';
const colorBorder = '2px solid #ff9662';
const data = {};
const keyLS = 'form-data';

function changeBgColor(el, currentColor = colorBackground) {
  el.style.background = currentColor;
}

function changeBorderColor(el, currentColor = colorBorder) {
  el.style.border = currentColor;
}

function saveLs(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

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
      changeBorderColor(input, '1px solid #ded47b');
      data[name] = value;
    }
  });
}

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
    alert('Форма успішно відправлена ✅');
  }
}
