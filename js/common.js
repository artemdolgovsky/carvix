function safe(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// функция цены автомобиля
function money(num) {
  return Number(num).toLocaleString('ru-RU') + ' BYN';
}

// функция берет текст из xmlтега
function getText(node, name) {
  const item = node.getElementsByTagName(name)[0];
  return item ? item.textContent.trim() : '';
}

// функция берет список одинаковых тегов из xml
function getList(node, name) {
  const tags = node.getElementsByTagName(name);
  const list = [];

  for (let i = 0; i < tags.length; i++) {
    list.push(tags[i].textContent.trim());
  }

  return list;
}

// функция превращает xml в массив 
function parseCars(xml) {
  const tags = xml.getElementsByTagName('car');
  const fields = ['brand', 'model', 'year', 'price', 'mileage', 'fuel', 'transmission', 'drive', 'market', 'body', 'engine', 'kuzov', 'restailing', 'consumption', 'power', 'badge', 'shortDescription', 'description'];
  const cars = [];

  for (let i = 0; i < tags.length; i++) {
    const item = tags[i];
    const images = getList(item, 'image');

    const car = {
      id: item.getAttribute('id'),
      featured: item.getAttribute('featured') === 'true'
    };

    // основные данные об авто
    for (let j = 0; j < fields.length; j++) {
      car[fields[j]] = getText(item, fields[j]);
    }

    car.price = Number(car.price);
    car.mileage = Number(car.mileage);
    car.image = images[0];
    car.images = images;
    car.features = getList(item, 'feature');

    cars.push(car);
  }

  return cars;
}

// фукнция загрузки xmlфайла
function loadCars(done) {
  const request = new XMLHttpRequest();

  request.open('GET', 'data/cars.xml');

  request.onload = function () {
    const xml = request.responseXML || new DOMParser().parseFromString(request.responseText, 'text/xml');
    done(parseCars(xml));
  };

  request.onerror = function () {
    done([]);
  };

  request.send();
}

// функция создания карточки авто
function makeCarCard(car) {
  const title = safe(car.brand + ' ' + car.model);
  const text = safe(car.shortDescription || car.description);

  return `
    <a class="card car-card" href="car.html?id=${safe(car.id)}">
      <div class="car-card_media">
        <img src="${safe(car.image)}" alt="${title}" loading="lazy">
        <span class="car-card_badge">${safe(car.badge)}</span>
      </div>

      <div class="car-card_body">
        <div class="car-card_meta">${safe(car.year)} · ${car.mileage.toLocaleString('ru-RU')} км</div>
        <h3 class="car-card_name">${title}</h3>

        <div class="car-card_specs">
          <span>${safe(car.fuel)}</span><span>•</span>
          <span>${safe(car.transmission)}</span><span>•</span>
          <span>${safe(car.market)}</span>
        </div>

        <p class="car-card_desc">${text}</p>

        <div class="car-card_footer">
          <div class="car-card_price">${money(car.price)}</div>
        </div>
      </div>
    </a>
  `;
}

// функция для меню и активной страницы
function startMenu() {
  const page = document.body.getAttribute('data-page');
  const links = document.querySelectorAll('[data-nav]');
  const button = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  const menuIcon = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const closeIcon = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  // подсвечивается активная страница в меню
  for (let i = 0; i < links.length; i++) {
    if (links[i].getAttribute('data-nav') === page) {
      links[i].classList.add('is-active');
    }
  }

  if (!button || !panel) return;

  button.innerHTML = menuIcon;

  // мобильное меню
  button.onclick = function () {
    panel.classList.toggle('is-open');
    button.innerHTML = panel.classList.contains('is-open') ? closeIcon : menuIcon;
  };
}

startMenu();