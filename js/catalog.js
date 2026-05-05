// данные со страницы каталога
const grid = document.getElementById('catalogGrid');
const search = document.getElementById('filterSearch');
const market = document.getElementById('filterMarket');
const body = document.getElementById('filterBody');
const fuel = document.getElementById('filterFuel');
const sort = document.getElementById('filterSort');
const count = document.getElementById('catalogCount');
const empty = document.getElementById('catalogEmpty');
const reset = document.getElementById('filterReset');

let cars = [];

// функция вывода автомобилей в каталоге
function showCatalog() {
  const result = [];
  const q = search.value.toLowerCase();
  let html = '';

  // проверка фильтров
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const text = (car.brand + ' ' + car.model + ' ' + car.body + ' ' + car.fuel).toLowerCase();

    if (q && text.indexOf(q) === -1) continue;
    if (market.value && car.market !== market.value) continue;
    if (body.value && car.body !== body.value) continue;
    if (fuel.value && car.fuel !== fuel.value) continue;

    result.push(car);
  }

  // сортировка
  if (sort.value === 'price-asc') result.sort(function (a, b) { return a.price - b.price; });
  if (sort.value === 'price-desc') result.sort(function (a, b) { return b.price - a.price; });
  if (sort.value === 'year-desc') result.sort(function (a, b) { return b.year - a.year; });
  if (sort.value === 'mileage-asc') result.sort(function (a, b) { return a.mileage - b.mileage; });

  // создание карточек авто
  for (let i = 0; i < result.length; i++) {
    html += makeCarCard(result[i]);
  }

  grid.innerHTML = html;
  count.textContent = result.length;
  empty.classList.toggle('is-visible', result.length === 0);
}

if (grid) {
  // обновление каталога
  search.oninput = showCatalog;
  market.onchange = showCatalog;
  body.onchange = showCatalog;
  fuel.onchange = showCatalog;
  sort.onchange = showCatalog;

  // сброс фильтров
  reset.onclick = function () {
    search.value = '';
    market.value = '';
    body.value = '';
    fuel.value = '';
    sort.value = '';
    showCatalog();
  };

  // загрузка авто из xml
  loadCars(function (data) {
    cars = data;
    showCatalog();
  });
}