import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import { modalDescriptions } from '../data/index.js';
import { generateModalHTML } from '../data/modalDescriptions/templates/generateModalHTML.js';

document.querySelectorAll('.btn-more').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.service;
    const data = modalDescriptions[key];
    const html = generateModalHTML(data);

    const instance = basicLightbox.create(html, {
      blur: 3,
      onShow: instance => {
        const close = instance.element().querySelectorAll('.modal-close');
        close.forEach(el =>
          el.addEventListener('click', () => instance.close())
        );
      },
    });

    instance.show();
  });
});
