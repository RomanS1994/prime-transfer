import { loadFormFromLS } from '../storage/localStorage.js';

import { setFrom, setTo } from './inputs.js';

let manualFromMarker, manualToMarker;

// ✅ Додано параметри map і Marker
export function restoreMarkers({ map, Marker }) {
  const saved = loadFormFromLS();

  if (saved['get-in-coords']) {
    const coords = saved['get-in-coords'];
    const location = new google.maps.LatLng(coords.lat, coords.lng);
    const place = {
      geometry: { location },
      formatted_address: saved['get-in'],
    };

    document.getElementById('get-in').value = saved['get-in'] || '';
    setFrom(place);
  }

  if (saved['get-out-coords']) {
    const coords = saved['get-out-coords'];
    const location = new google.maps.LatLng(coords.lat, coords.lng);
    const place = {
      geometry: { location },
      formatted_address: saved['get-out'],
    };

    document.getElementById('get-out').value = saved['get-out'] || '';
    setTo(place);
  }
}
