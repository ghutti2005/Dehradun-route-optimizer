// Initialize Leaflet map
const map = L.map('map').setView([30.3165, 78.0322], 12);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add markers for all delivery points
for (let place in deliveryPoints) {
  const marker = L.marker(deliveryPoints[place]).addTo(map);
  marker.bindPopup(`<b>${place}</b>`);
}

// Global variable to store the drawn route
let currentPolyline = null;

/**
 * Draws a path on the map.
 * @param {string[]} path - An array of node names in order.
 * @param {string} color - Optional color for the path line.
 */
function drawPathOnMap(path, color = 'blue') {
  // Remove previous polyline if it exists
  if (currentPolyline) {
    map.removeLayer(currentPolyline);
  }

  // Convert path to lat/lng
  const latlngs = path.map(place => deliveryPoints[place]);

  // Draw new polyline
  currentPolyline = L.polyline(latlngs, {
    color: color,
    weight: 5,
    opacity: 0.8
  }).addTo(map);

  // Fit map bounds to new path
  map.fitBounds(currentPolyline.getBounds());
}
