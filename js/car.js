//получаем элементы со страницы одного автомобиля
const place = document.getElementById('carDetail');
const similar = document.getElementById('similarCars');
const id = new URLSearchParams(location.search).get('id');

//функция создает одну строку характеристики
function addSpec(name, value) {
  return `<div><span>${safe(name)}</span><strong>${safe(value)}</strong></div>`;
}

//галерея фотографий
function makeGallery(car) {
  const images = car.images.length ? car.images : [car.image];
  const title = safe(car.brand + ' ' + car.model);
  let slides = '';
  let dots = '';

  for (let i = 0; i < images.length; i++) {
    const activeSlide = i === 0 ? ' gallery-slide_active' : '';
    const activeDot = i === 0 ? ' gallery-dot_active' : '';

    slides += `<div class="gallery-slide${activeSlide}">
      <img src="${safe(images[i])}" alt="${title}" loading="lazy">
    </div>`;

    dots += `<button class="gallery-dot${activeDot}" type="button"></button>`;
  }

  return `<div class="detail-media">
    <div class="gallery-track">${slides}</div>
    <button class="gallery-btn gallery-btn_prev" type="button">‹</button>
    <button class="gallery-btn gallery-btn_next" type="button">›</button>
    <div class="gallery-dots">${dots}</div>
  </div>`;
}

//функция вывода всей страницы автомобиля
function showCar(car) {
  const data = [
    ['Марка', car.brand], ['Модель', car.restailing],
    ['Год выпуска', car.year], ['Двигатель', car.engine],
    ['Кузов', car.kuzov], ['Топливо', car.fuel],
    ['Мощность', car.power], ['Привод', car.drive],
    ['Пробег', car.mileage.toLocaleString('ru-RU') + ' км'],
    ['Расход на 100 км', car.consumption]
  ];

  let specs = '';
  let features = '';
  //характеристики автомобиля
  for (let i = 0; i < data.length; i++) {
    specs += addSpec(data[i][0], data[i][1]);
  }

  //список комплектации
  for (let i = 0; i < car.features.length; i++) {
    features += `<div class="feature-item">
      <span class="feature-dot">✓</span>
      <span>${safe(car.features[i])}</span>
    </div>`;
  }

  place.innerHTML = `<div class="detail-layout">
    <div class="detail-main">
      ${makeGallery(car)}

      <section class="card detail-full">
        <h2>Полная характеристика</h2>
        <div class="full-specs">${specs}</div>

        <div class="detail-section">
          <h2>Описание автомобиля</h2>
          <p>${safe(car.description)}</p>
        </div>

        <div class="detail-section">
          <h2>Комплектация</h2>
          <div class="feature-list">${features}</div>
        </div>
      </section>
    </div>

    <aside class="card detail-panel">
      <h1 class="detail-title">${safe(car.brand + ' ' + car.model)}</h1>
      <p class="detail-meta">${safe(car.year)} · ${safe(car.drive)} привод · ${safe(car.transmission)} · ${safe(car.market)}</p>
      <p class="detail-short">${safe(car.shortDescription || car.description)}</p>

      <div class="price-box">
        <div class="price-box_label">Цена автомобиля</div>
        <div class="price-box_value">${money(car.price)}</div>

        <div class="tags">
          <span class="tag">Стоимость фиксирована</span>
          <span class="tag">Доставка по Беларуси</span>
          <span class="tag">Без обременений</span>
          <span class="tag">Полный комплект документов</span>
        </div>
      </div>

      <div class="detail-actions">
        <a class="button button--primary button--full" href="contact.html">Оформить заказ</a>
        <a class="button button--secondary button--full" href="contact.html">Задать вопрос</a>
      </div>
    </aside>
  </div>`;

  startSlider();
}

//функция слайдера фото
function startSlider() {
  const slides = document.querySelectorAll('.gallery-slide');
  const dots = document.querySelectorAll('.gallery-dot');
  let active = 0;

  if (slides.length < 2) return;

  function showSlide(num) {
    slides[active].classList.remove('gallery-slide_active');
    dots[active].classList.remove('gallery-dot_active');

    active = (num + slides.length) % slides.length;

    slides[active].classList.add('gallery-slide_active');
    dots[active].classList.add('gallery-dot_active');
  }

  //кнопка назад
  document.querySelector('.gallery-btn_prev').onclick = function () {
    showSlide(active - 1);
  };

  //кнопка вперед
  document.querySelector('.gallery-btn_next').onclick = function () {
    showSlide(active + 1);
  };
}

if (place) {
  // загрузка всех автомобилей и выбор нужного айди
  loadCars(function (cars) {
    if (cars.length === 0) return;

    let car = cars[0];
    let html = '';
    let count = 0;

    for (let i = 0; i < cars.length; i++) {
      if (cars[i].id === id) car = cars[i];
    }

    showCar(car);

    // похожие модели
    for (let i = 0; i < cars.length; i++) {
      if (cars[i].id !== car.id && count < 3) {
        html += makeCarCard(cars[i]);
        count++;
      }
    }

    similar.innerHTML = html;
  });
}