//route.js
let directionsService; // для побудови маршруту
let directionsRenderer; // для візуалізації маршруту на мапі
let distanceService; // для підрахунку відстані та часу
let fromPlace = null; // місце початку (A)
let toPlace = null; // місце призначення (B)
let mapRef = null; // сама карта
let mapKmEl = null; // елемент, куди вставляється км
let mapTimeEl = null; // елемент, куди вставляється час

// Ініціалізація маршрутів і відображення на карті
export function initRouting({
  map,
  DirectionsService,
  DirectionsRenderer,
  DistanceMatrixService,
}) {
  directionsService = new DirectionsService(); // для створення маршруту
  directionsRenderer = new DirectionsRenderer({ suppressMarkers: true }); // не малює автоматично маркери
  directionsRenderer.setMap(map); // показує маршрут на карті

  distanceService = new DistanceMatrixService(); // для підрахунку км/часу
  mapRef = map;

  mapKmEl = document.querySelector('.map-km'); // HTML-елементи
  mapTimeEl = document.querySelector('.map-time');
}

// Встановлює точку початку маршруту (A) і оновлює маршрут
export function setFromPlace(place) {
  fromPlace = place;
  calculateAndDisplayRoute();
}

// Встановлює точку призначення маршруту (B) і оновлює маршрут
export function setToPlace(place) {
  toPlace = place;
  calculateAndDisplayRoute();
}

// Будує маршрут і розраховує відстань і тривалість поїздки
export function calculateAndDisplayRoute() {
  if (!fromPlace || !toPlace) return; // якщо не вибрані обидві точки — нічого не робимо

  // Побудова маршруту на мапі
  directionsService.route(
    {
      origin: fromPlace.geometry.location, // координати точки A
      destination: toPlace.geometry.location, // координати точки B
      travelMode: google.maps.TravelMode.DRIVING, // тип транспорту
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result); // малюємо маршрут
      } else {
        console.error('Directions error:', status);
      }
    }
  );

  // Обрахунок відстані і часу
  distanceService.getDistanceMatrix(
    {
      origins: [fromPlace.geometry.location],
      destinations: [toPlace.geometry.location],
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        const element = response.rows[0].elements[0];
        mapKmEl.textContent = element.distance.text; // вставляємо км у HTML
        mapTimeEl.textContent = element.duration.text; // вставляємо час у HTML
      } else {
        console.error('DistanceMatrix error:', status);
      }
    }
  );
}

// функція очищення маршруту
export function clearRoute() {
  if (directionsRenderer) {
    directionsRenderer.set('directions', null); // очищає маршрут
  }

  if (mapKmEl) mapKmEl.textContent = '';
  if (mapTimeEl) mapTimeEl.textContent = '';

  // очищає внутрішні змінні
  fromPlace = null;
  toPlace = null;
}
