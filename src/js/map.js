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
  key: 'AIzaSyDenJrU1OnfLreiz4i6a7dyoBeSLK02F7Y',
  v: 'weekly',
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

const API_key = 'AIzaSyDenJrU1OnfLreiz4i6a7dyoBeSLK02F7Y';

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

  const defaultLocation = { lat: 50.0755, lng: 14.4378 }; // Прага

  const map = new Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 13,
  });

  // const dataInputAdress = {
  //   get-in: ''
  //   get-out:
  // }

  const directionsService = new DirectionsService();
  const directionsRenderer = new DirectionsRenderer();
  directionsRenderer.setMap(map);

  const fromInput = document.getElementById('get-in');
  const toInput = document.getElementById('get-out');

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

    // Distance Matrix for time and distance
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
          console.log('Distance:', result.distance.text);
          console.log('Duration:', result.duration.text);
        } else {
          console.error('DistanceMatrix error:', status);
        }
      }
    );
  };

  fromAutocomplete.addListener('place_changed', () => {
    fromPlace = fromAutocomplete.getPlace();
    if (!fromPlace.geometry) {
      alert('No geometry for origin address');
      return;
    }

    //  const  fromPlace.formatted_address;
    // console.log('FROM - точна адреса:', fromPlace.formatted_address);
    console.dir(fromInput);

    calculateAndDisplayRoute();
  });

  toAutocomplete.addListener('place_changed', () => {
    toPlace = toAutocomplete.getPlace();
    if (!toPlace.geometry) {
      alert('No geometry for destination address');
      return;
    }
    // Отримання значення з автокомпліту
    console.log('TO - точна адреса:', toPlace.formatted_address);
    calculateAndDisplayRoute();
  });
})();
