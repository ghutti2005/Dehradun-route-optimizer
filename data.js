// Coordinates for each delivery point in Dehradun
const deliveryPoints = {
  "Graphic Era University": [30.2722, 78.0796],
  "Bindal Bridge": [30.2728, 78.0645],
  "Ballupur Chowk": [30.2853, 78.0312],
  "Clock Tower": [30.3256, 78.0437],
  "ISBT Dehradun": [30.2849, 77.9992],
  "FRI": [30.3450, 77.9945],
  "Rajpur Road": [30.3503, 78.0807],
  "Dehradun Railway Station": [30.3165, 78.0322],
  "Survey Chowk": [30.3185, 78.0402],
  "Subhash Road": [30.3162, 78.0495],
  "Paltan Bazaar": [30.3241, 78.0430],
  "Dilaram Chowk": [30.3367, 78.0601],
  "Pacific Mall": [30.3912, 78.0832],
  "Mussoorie Diversion": [30.3645, 78.0889],
  "Prem Nagar": [30.3426, 77.9618],
  "Kargi Chowk": [30.2839, 77.9856],
  "Clement Town": [30.2511, 78.0225],
  "VIDYA MANDIR": [30.2681, 78.0807],
  "ICFAI University": [30.2934, 78.0465],
  "Mothrowala": [30.2961, 77.9844]
};

// Weighted undirected graph: distance in kilometers (approx)
const graph = {
  "Graphic Era University": { "VIDYA MANDIR": 1, "Bindal Bridge": 3 },
  "Bindal Bridge": { "Ballupur Chowk": 3, "Graphic Era University": 3 },
  "Ballupur Chowk": { "ISBT Dehradun": 4, "Clock Tower": 2, "ICFAI University": 3, "Dehradun Railway Station": 2 },
  "Clock Tower": { "Paltan Bazaar": 1, "Survey Chowk": 2, "Subhash Road": 2 },
  "ISBT Dehradun": { "Kargi Chowk": 3 },
  "FRI": { "Kargi Chowk": 3, "Prem Nagar": 3 },
  "Rajpur Road": { "Pacific Mall": 5, "Dilaram Chowk": 2, "Mussoorie Diversion": 2 },
  "Dehradun Railway Station": { "Ballupur Chowk": 2, "Survey Chowk": 2 },
  "Survey Chowk": { "Subhash Road": 1, "Dehradun Railway Station": 2 },
  "Subhash Road": { "Clock Tower": 2 },
  "Paltan Bazaar": { "Dilaram Chowk": 2, "Clock Tower": 1 },
  "Dilaram Chowk": { "Rajpur Road": 2, "Paltan Bazaar": 2 },
  "Pacific Mall": { "Mussoorie Diversion": 2 },
  "Prem Nagar": { "FRI": 3 },
  "Kargi Chowk": { "ISBT Dehradun": 3, "FRI": 3, "Mothrowala": 3, "Clement Town": 3 },
  "Clement Town": { "VIDYA MANDIR": 2, "Kargi Chowk": 3 },
  "VIDYA MANDIR": { "Graphic Era University": 1, "Clement Town": 2 },
  "ICFAI University": { "Ballupur Chowk": 3 },
  "Mussoorie Diversion": { "Rajpur Road": 2, "Pacific Mall": 2 },
  "Mothrowala": { "Kargi Chowk": 3 }
};

// Utility function: calculate Euclidean distance for A* heuristic
function getEuclideanDistance(pointA, pointB) {
  const [lat1, lon1] = deliveryPoints[pointA];
  const [lat2, lon2] = deliveryPoints[pointB];
  return Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2);
}

// If using ES modules or bundlers like Vite/Webpack, you can export:
if (typeof module !== "undefined") {
  module.exports = { deliveryPoints, graph, getEuclideanDistance };
}
