export function generateModalHTML(data) {
  return `
    <div class="modal-inner">
      <h2 class="modal-ds-title">${data.title}</h2>
      <div class="modal-imgList-wrapper">
        <img class="modal-ds-img" src="${data.image}" alt="" />
        <ul class="modal-ds-list">
          ${data.list
            .map(
              item =>
                `<li class="modal-ds-item"><p class="modal-ds-text">${item}</p></li>`
            )
            .join('')}
        </ul>
      </div>
      <div class="line"></div>
      <h3 class="modal-ds-subtitle">${data.subtitle}</h3>
      <p class="modal-ds-text">${data.text}</p>
      <a href="#contacts">
      <button class="button modal-close">Замовити трансфер</button>
      </a>
      <button class="button-modal-close modal-close">
        <svg class="mpdal-close-svg " width="24" height="24">
          <use href="/img/svg/sprite.svg#close"></use>
        </svg>
      </button>
    </div>
  `;
}
