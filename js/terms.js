//получаем все кнопки аккордеона
const buttons = document.querySelectorAll('[data-accordion-button]');

for (let i = 0; i < buttons.length; i++) {
  // при нажатии открывается или закрывается блок
  buttons[i].onclick = function () {
    const panel = this.nextElementSibling;
    const plus = this.querySelector('span');

    panel.classList.toggle('is-open');

    // меняется плюс на минус 
    plus.textContent = panel.classList.contains('is-open') ? '−' : '+';
  };
}