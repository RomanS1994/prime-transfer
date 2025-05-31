const API_key = 'AIzaSyDenJrU1OnfLreiz4i6a7dyoBeSLK02F7Y';

(g => {
  var h,
    a,
    k,
    p = 'The Google Maps JavaScript API',
    c = 'google',
    l = 'importLibrary',
    q = '__ib__',
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement('script'));
        e.set('libraries', [...r] + '');
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, t => '_' + t[0].toLowerCase()),
            g[k]
          );
        e.set('callback', c + '.maps.' + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + ' could not load.')));
        a.nonce = m.querySelector('script[nonce]')?.nonce || '';
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + ' only loads once. Ignoring:', g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: API_key,
  v: 'weekly',
});

(async () => {
  const [
    { Map },
    { Marker },
    { Autocomplete },
    { DirectionsService, DirectionsRenderer, DistanceMatrixService },
  ] = await Promise.all([
    google.maps.importLibrary('maps'),
    google.maps.importLibrary('marker'),
    google.maps.importLibrary('places'),
    google.maps.importLibrary('routes'),
  ]);

  const defaultLocation = { lat: 50.0755, lng: 14.4378 };
  const map = new Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 12,
  });

  const directionsService = new DirectionsService();
  const directionsRenderer = new DirectionsRenderer({ suppressMarkers: true });
  directionsRenderer.setMap(map);

  const fromInput = document.getElementById('get-in');
  const toInput = document.getElementById('get-out');
  const mapKm = document.querySelector('.map-km');
  const mapTime = document.querySelector('.map-time');

  const fromAutocomplete = new Autocomplete(fromInput, {
    types: ['geocode'],
    componentRestrictions: { country: 'cz' },
  });
  const toAutocomplete = new Autocomplete(toInput, {
    types: ['geocode'],
    componentRestrictions: { country: 'cz' },
  });

  let fromPlace = null;
  let toPlace = null;
  let manualFromMarker = null;
  let manualToMarker = null;
  let isSettingFrom = true;

  const calculateAndDisplayRoute = () => {
    if (!fromPlace || !toPlace) return;

    directionsService.route(
      {
        origin: fromPlace.geometry.location,
        destination: toPlace.geometry.location,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );

    const distanceService = new DistanceMatrixService();
    distanceService.getDistanceMatrix(
      {
        origins: [fromPlace.geometry.location],
        destinations: [toPlace.geometry.location],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const result = response.rows[0].elements[0];
          mapKm.textContent = result.distance.text;
          mapTime.textContent = result.duration.text;
        } else {
          console.error('DistanceMatrix error:', status);
        }
      }
    );
  };

  const saveCoordsToLS = () => {
    const data = {
      'get-in': fromInput.value,
      'get-out': toInput.value,
      'get-in-coords': fromPlace?.geometry.location.toJSON(),
      'get-out-coords': toPlace?.geometry.location.toJSON(),
    };
    localStorage.setItem('form-data', JSON.stringify(data));
  };

  map.addListener('click', e => {
    disableCursorPickMode();
    const clickedLocation = e.latLng;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: clickedLocation }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;

        if (isSettingFrom) {
          if (manualFromMarker) manualFromMarker.setMap(null);
          manualFromMarker = new Marker({
            position: clickedLocation,
            map: map,
            label: 'A',
          });
          fromInput.value = address;
          fromPlace = { geometry: { location: clickedLocation } };
        } else {
          if (manualToMarker) manualToMarker.setMap(null);
          manualToMarker = new Marker({
            position: clickedLocation,
            map: map,
            label: 'B',
          });
          toInput.value = address;
          toPlace = { geometry: { location: clickedLocation } };
        }

        saveCoordsToLS(); // ✅ Явне збереження адрес + координат
        calculateAndDisplayRoute();
      } else {
        console.error('Geocoder failed: ' + status);
        alert('Не вдалося отримати адресу з координат.');
      }
    });
  });

  fromAutocomplete.addListener('place_changed', () => {
    const place = fromAutocomplete.getPlace();
    if (!place.geometry) return;

    fromInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    fromPlace = place;

    if (manualFromMarker) manualFromMarker.setMap(null);
    manualFromMarker = new Marker({
      position: place.geometry.location,
      map: map,
      label: 'A',
    });

    saveCoordsToLS();
    calculateAndDisplayRoute();
  });

  toAutocomplete.addListener('place_changed', () => {
    const place = toAutocomplete.getPlace();
    if (!place.geometry) return;

    toInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
    toPlace = place;

    if (manualToMarker) manualToMarker.setMap(null);
    manualToMarker = new Marker({
      position: place.geometry.location,
      map: map,
      label: 'B',
    });

    saveCoordsToLS();
    calculateAndDisplayRoute();
  });

  // Відновлення з LS
  const savedData = JSON.parse(localStorage.getItem('form-data') || '{}');

  if (savedData['get-in-coords']) {
    const coords = savedData['get-in-coords'];
    const location = new google.maps.LatLng(coords.lat, coords.lng);
    manualFromMarker = new Marker({ position: location, map, label: 'A' });
    fromPlace = { geometry: { location } };
    fromInput.value = savedData['get-in'] || '';
    fromInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
  }

  if (savedData['get-out-coords']) {
    const coords = savedData['get-out-coords'];
    const location = new google.maps.LatLng(coords.lat, coords.lng);
    manualToMarker = new Marker({ position: location, map, label: 'B' });
    toPlace = { geometry: { location } };
    toInput.value = savedData['get-out'] || '';
    toInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
  }

  if (fromPlace && toPlace) {
    calculateAndDisplayRoute();
  }

  const fromBtn = document.getElementById('set-from-btn');
  const toBtn = document.getElementById('set-to-btn');

  if (fromBtn) {
    fromBtn.addEventListener('click', () => {
      isSettingFrom = true;
      enableCursorPickMode();
      alert('Натисніть на мапу, щоб вибрати місце посадки (Маркер A)');
    });
  }

  if (toBtn) {
    toBtn.addEventListener('click', () => {
      isSettingFrom = false;
      enableCursorPickMode();
      alert('Натисніть на мапу, щоб вибрати місце висадки (Маркер B)');
    });
  }

  function enableCursorPickMode() {
    document.getElementById('map').classList.add('map-pick-mode');
  }

  function disableCursorPickMode() {
    document.getElementById('map').classList.remove('map-pick-mode');
  }
})();
