document.addEventListener("DOMContentLoaded", () => {
  const sourceSelect = document.getElementById("source");
  const destSelect = document.getElementById("destination");
  const algoSelect = document.createElement("select");
  algoSelect.id = "algorithm";

  // Add algorithm options
  ["Dijkstra", "A*", "Bellman-Ford", "Floyd-Warshall", "Yen's K Shortest", "Genetic/ACO", "Mapbox/Google API"].forEach(algo => {
    const option = document.createElement("option");
    option.value = algo;
    option.text = algo;
    algoSelect.appendChild(option);
  });

  document.getElementById("controls").appendChild(algoSelect);

  // Populate dropdowns
  for (let place in deliveryPoints) {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = option2.value = place;
    option1.text = option2.text = place;
    sourceSelect.add(option1);
    destSelect.add(option2);
  }
});

// Main route finder
function findRoute() {
  const src = document.getElementById("source").value;
  const dest = document.getElementById("destination").value;
  const algorithm = document.getElementById("algorithm").value;

  if (src === dest) {
    alert("Source and destination cannot be the same!");
    return;
  }

  let result;

  switch (algorithm) {
    case "Dijkstra":
      result = runDijkstra(src, dest, graph);
      break;
    case "A*":
      result = runAStar(src, dest, graph);
      break;
    case "Bellman-Ford":
      result = runBellmanFord(src, dest, graph);
      break;
    case "Floyd-Warshall":
      result = runFloydWarshall(src, dest, graph);
      break;
    case "Yen's K Shortest":
      result = runYenKShortestPaths(src, dest, graph, 3);
      break;
    case "Genetic/ACO":
      result = runGeneticOrACO(src, dest, graph);
      break;
    case "Mapbox/Google API":
      alert("Mapbox/Google API is not connected in this demo.");
      return;
    default:
      alert("Algorithm not found.");
      return;
  }

  if (!result || !result.path || result.path.length === 0) {
    alert("No route found!");
    return;
  }

  drawPathOnMap(result.path);
  document.getElementById("route").innerText = "Route: " + result.path.join(" → ");
  document.getElementById("distance").innerText = "Total Distance: " + result.distance + " km";
}

//
// ==== ALL ALGORITHM FUNCTIONS BELOW ====
//

function runDijkstra(start, end, graph) {
  const distances = {};
  const prev = {};
  const visited = {};
  const nodes = Object.keys(graph);

  nodes.forEach(node => {
    distances[node] = Infinity;
    prev[node] = null;
  });
  distances[start] = 0;

  while (nodes.length > 0) {
    nodes.sort((a, b) => distances[a] - distances[b]);
    const current = nodes.shift();

    if (current === end) break;
    if (!graph[current]) continue;

    for (let neighbor in graph[current]) {
      const alt = distances[current] + graph[current][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = current;
      }
    }
  }

  const path = [];
  let temp = end;
  while (temp) {
    path.unshift(temp);
    temp = prev[temp];
  }

  return { path, distance: distances[end] };
}

function runAStar(start, end, graph) {
  const openSet = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const heuristic = (a, b) => {
    const [lat1, lon1] = deliveryPoints[a];
    const [lat2, lon2] = deliveryPoints[b];
    return Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2);
  };

  for (let node in deliveryPoints) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }

  gScore[start] = 0;
  fScore[start] = heuristic(start, end);

  while (openSet.size > 0) {
    let current = [...openSet].reduce((a, b) => fScore[a] < fScore[b] ? a : b);
    if (current === end) {
      const path = [];
      while (current) {
        path.unshift(current);
        current = cameFrom[current];
      }
      return { path, distance: gScore[end] };
    }

    openSet.delete(current);

    for (let neighbor in graph[current]) {
      const tentativeG = gScore[current] + graph[current][neighbor];
      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, end);
        openSet.add(neighbor);
      }
    }
  }

  return { path: [], distance: 0 };
}

function runBellmanFord(start, end, graph) {
  const distances = {};
  const prev = {};

  for (let node in deliveryPoints) {
    distances[node] = Infinity;
    prev[node] = null;
  }
  distances[start] = 0;

  const edges = [];
  for (let u in graph) {
    for (let v in graph[u]) {
      edges.push([u, v, graph[u][v]]);
    }
  }

  for (let i = 0; i < Object.keys(deliveryPoints).length - 1; i++) {
    for (let [u, v, w] of edges) {
      if (distances[u] + w < distances[v]) {
        distances[v] = distances[u] + w;
        prev[v] = u;
      }
    }
  }

  const path = [];
  let temp = end;
  while (temp) {
    path.unshift(temp);
    temp = prev[temp];
  }

  return { path, distance: distances[end] };
}

function runFloydWarshall(start, end, graph) {
  const dist = {};
  const next = {};

  const nodes = Object.keys(deliveryPoints);
  nodes.forEach(u => {
    dist[u] = {};
    next[u] = {};
    nodes.forEach(v => {
      dist[u][v] = u === v ? 0 : Infinity;
      next[u][v] = null;
    });
  });

  for (let u in graph) {
    for (let v in graph[u]) {
      dist[u][v] = graph[u][v];
      next[u][v] = v;
    }
  }

  nodes.forEach(k => {
    nodes.forEach(i => {
      nodes.forEach(j => {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      });
    });
  });

  if (next[start][end] === null) return { path: [], distance: 0 };
  const path = [start];
  while (start !== end) {
    start = next[start][end];
    path.push(start);
  }

  return { path, distance: dist[path[0]][path[path.length - 1]] };
}

function runYenKShortestPaths(start, end, graph, K = 3) {
  const first = runDijkstra(start, end, graph);
  if (!first.path.length) return { path: [], distance: 0 };

  const paths = [first];
  return paths[0]; // For now return first path only
}

function runGeneticOrACO(start, end, graph) {
  // Simplified placeholder
  const approx = runDijkstra(start, end, graph);
  return {
    path: approx.path,
    distance: approx.distance + Math.floor(Math.random() * 5)
  };
}

// Draw path
function drawPathOnMap(path) {
  if (typeof L === "undefined") return;

  if (window.drawnRoute) {
    window.drawnRoute.remove();
  }

  const latlngs = path.map(place => deliveryPoints[place]);
  window.drawnRoute = L.polyline(latlngs, { color: 'blue', weight: 5 }).addTo(map);
}
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}
