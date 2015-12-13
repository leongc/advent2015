// problem http://adventofcode.com/day/9
// input http://adventofcode.com/day/9/input

var distances = {}; // map of source city to (map of destination cities to distance)
function addRoute(source, destination, distance) {
  if (distances[source] === undefined) {
    distances[source] = {};
  }
  distances[source][destination] = distance;
  if (distances[destination] === undefined) {
    distances[destination] = {};
  }
  distances[destination][source] = distance;
}
function parseLine(s) {
  if (!s) {
    return;
  }
  var citiesDistance = s.split(' = ');
  var cities = citiesDistance[0].split(' to ');
  var distance = Number.parseInt(citiesDistance[1]);
  addRoute(cities[0], cities[1], distance);
}
var input = document.body.innerText.split('\n');
for (var i = 0; i < input.length; i++) {
  parseLine(input[i]);
}
var allMinPath = Infinity;
function getMinPath(currentDistance, currentCity, otherCities) {
  if (otherCities.length < 1) {
    return currentDistance;
  }
  var minPath = Infinity;
  for (var k = 0; k < otherCities.length; k++) {
    var nextCity = otherCities[k];
    var nextDistance = currentDistance + distances[currentCity][nextCity];
    if (nextDistance > allMinPath) {
      continue;
    }
    var nextOtherCities = otherCities.slice(0);
    nextOtherCities.splice(k, 1);
    minPath = Math.min(minPath, getMinPath(nextDistance, nextCity, nextOtherCities));
  }
  return minPath;
}
var allCities = Object.keys(distances);
for (var j = 0; j < allCities.length; j++) {
  var startCity = allCities[j];
  var otherCities = allCities.slice(0); // make a copy with slice because splice mutates it
  otherCities.splice(j, 1);
  allMinPath = Math.min(allMinPath, getMinPath(0, startCity, otherCities));
}
console.log(allMinPath);

// part B

var allMaxPath = 0;
function getMaxPath(currentDistance, currentCity, otherCities) {
  if (otherCities.length < 1) {
    return currentDistance;
  }
  var maxPath = 0;
  for (var k = 0; k < otherCities.length; k++) {
    var nextCity = otherCities[k];
    var nextDistance = currentDistance + distances[currentCity][nextCity];
    var nextOtherCities = otherCities.slice(0);
    nextOtherCities.splice(k, 1);
    maxPath = Math.max(maxPath, getMaxPath(nextDistance, nextCity, nextOtherCities));
  }
  return maxPath;
}
for (var j = 0; j < allCities.length; j++) {
  var startCity = allCities[j];
  var otherCities = allCities.slice(0); // make a copy with slice because splice mutates it
  otherCities.splice(j, 1);
  allMaxPath = Math.max(allMaxPath, getMaxPath(0, startCity, otherCities));
}
console.log(allMaxPath);
