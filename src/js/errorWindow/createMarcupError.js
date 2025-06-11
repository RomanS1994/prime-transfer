export function generateErrorHTMLWindow() {
  return `
    <div class="error_modal">
      <svg class="mpdal-close-svg error_modal-svg-close " width="24" height="24">
        <use href="../public/img/svg/sprite.svg#close"></use>
      </svg>
      <h2 class="error_modal-title">В розробці</h2>
      <p class="error_modal-subtitle">
        Ви подорожуєте — ми працюємо над вашим комфортом!
      </p>
      <button class="button button-order modal-close">Продовжити</button>
    </div>
`;
}
