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

