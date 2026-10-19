const BATUMI_VIEW = [41.6168, 41.6367];
let mapInstance = null;
let markerInstance = null;
let selectCallback = null;
let providerKind = null;

function loadScript(src, id) {
  const existing = document.getElementById(id);
  if (existing?.dataset.loaded === 'true') return Promise.resolve();
  if (existing?.dataset.loading === 'true') {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }
  const script = existing ?? document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  script.dataset.loading = 'true';
  const promise = new Promise((resolve, reject) => {
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      script.dataset.loading = 'false';
      resolve();
    }, { once: true });
    script.addEventListener('error', reject, { once: true });
  });
  if (!existing) document.head.append(script);
  return promise;
}

function loadLeafletStyles() {
  if (document.getElementById('leaflet-css')) return;
  const link = document.createElement('link');
  link.id = 'leaflet-css';
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.append(link);
}

function selectedPoint(lat, lng) {
  selectCallback?.({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
}

async function mount2Gis(container, initial, onSelect, key) {
  await loadScript('https://mapgl.2gis.com/api/js/v1', 'chefish-2gis-sdk');
  if (!window.mapgl?.Map || !window.mapgl?.Marker) throw new Error('2GIS MapGL did not initialize');
  const point = initial ?? { lat: BATUMI_VIEW[0], lng: BATUMI_VIEW[1] };
  selectCallback = onSelect;
  providerKind = '2gis';
  mapInstance = new window.mapgl.Map(container, {
    key,
    center: [point.lng, point.lat],
    zoom: 13,
  });
  markerInstance = new window.mapgl.Marker(mapInstance, { coordinates: [point.lng, point.lat] });
  mapInstance.on('click', (event) => {
    const coordinates = event?.lngLat;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return;
    markerInstance?.destroy?.();
    markerInstance = new window.mapgl.Marker(mapInstance, { coordinates });
    selectedPoint(coordinates[1], coordinates[0]);
  });
}

async function mountOpenStreetMap(container, initial, onSelect) {
  loadLeafletStyles();
  await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'chefish-leaflet-sdk');
  if (!window.L) throw new Error('Leaflet did not initialize');
  const point = initial ?? { lat: BATUMI_VIEW[0], lng: BATUMI_VIEW[1] };
  selectCallback = onSelect;
  providerKind = 'osm';
  mapInstance = window.L.map(container, { scrollWheelZoom: false }).setView([point.lat, point.lng], initial ? 16 : 13);
  window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
  }).addTo(mapInstance);
  markerInstance = window.L.marker([point.lat, point.lng], { draggable: true, autoPan: true }).addTo(mapInstance);
  markerInstance.on('dragend', () => {
    const position = markerInstance.getLatLng();
    selectedPoint(position.lat, position.lng);
  });
  mapInstance.on('click', (event) => {
    markerInstance.setLatLng(event.latlng);
    selectedPoint(event.latlng.lat, event.latlng.lng);
  });
}

export async function mountDeliveryMap(container, initialPoint, onSelect, onFailure) {
  if (!container) return;
  destroyDeliveryMap();
  const apiKey = document.querySelector('meta[name="digis-api-key"]')?.content?.trim() || window.CHEFISH_2GIS_API_KEY || '';
  try {
    if (apiKey) await mount2Gis(container, initialPoint, onSelect, apiKey);
    else await mountOpenStreetMap(container, initialPoint, onSelect);
  } catch (error) {
    console.warn('Delivery map unavailable:', error);
    destroyDeliveryMap();
    onFailure?.();
  }
}

export function geolocateOnMap() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      if (providerKind === 'osm' && mapInstance && markerInstance) {
        markerInstance.setLatLng([lat, lng]);
        mapInstance.setView([lat, lng], 16);
      } else if (providerKind === '2gis' && mapInstance) {
        mapInstance.setCenter([lng, lat]);
        markerInstance?.destroy?.();
        markerInstance = new window.mapgl.Marker(mapInstance, { coordinates: [lng, lat] });
      }
      selectedPoint(lat, lng);
      resolve({ lat, lng });
    }, reject, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  });
}

export function destroyDeliveryMap() {
  try {
    if (providerKind === 'osm') mapInstance?.remove();
    if (providerKind === '2gis') mapInstance?.destroy?.();
    markerInstance?.destroy?.();
  } catch {
    // Map instances may already have been detached during a route change.
  }
  mapInstance = null;
  markerInstance = null;
  providerKind = null;
  selectCallback = null;
}
