import * as basicLightbox from 'basiclightbox';
import { generateErrorHTMLWindow } from './createMarcupError.js';

const devList = document.querySelectorAll('[data-dev]');

devList.forEach(el => {
  if (el.dataset.dev === 'true') {
    el.addEventListener('click', handlerClick);
  }
});

function handlerClick(event) {
  event.preventDefault();

  const html = generateErrorHTMLWindow();

  const instance = basicLightbox.create(html, {
    onShow: instance => {
      // Закриття по .modal-close (будь-яка кнопка закриття)
      const closeBtns = instance.element().querySelectorAll('.modal-close');
      closeBtns.forEach(btn =>
        btn.addEventListener('click', () => instance.close())
      );

      // Додатково — закриття по SVG кнопці
      const closeSvg = instance
        .element()
        .querySelector('.error_modal-svg-close');
      if (closeSvg) {
        closeSvg.addEventListener('click', () => instance.close());
      }
    },
  });

  instance.show();
}
