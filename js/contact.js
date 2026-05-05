//получаем форму и поля со страницы контактов
const form = document.getElementById('contactForm');
const notice = document.getElementById('contactNotice');
const phone = document.getElementById('phone');

if (form) {
  //запрет букв в телефоне
  phone.oninput = function () {
    phone.value = phone.value.replace(/[^0-9+\-() ]/g, '');
  };

  //валидация формы
  form.onsubmit = function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const tel = phone.value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === '' || tel === '' || message === '') {
      alert('Заполните имя, телефон и сообщение.');
      return;
    }

    if (email !== '' && email.indexOf('@') === -1) {
      alert('В email должен быть символ @.');
      return;
    }

    // сообщение об отправке
    notice.classList.add('is-visible');
    form.reset();
  };
}