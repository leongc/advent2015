// problem: http://adventofcode.com/day/13
// input: http://adventofcode.com/day/13/input

var effect = {}; // key = affected, value = map of neighbor to effect
function addEffect(person, neighbor, effectOnPerson) {
  if (!effect[person]) {
    effect[person] = {};
  } 
  effect[person][neighbor] = effectOnPerson;
}
function parseLine(s) {
  if (!s) { return; }
  var headNeighbor = s.split(' happiness units by sitting next to ');
  var personEffect = headNeighbor[0].split(' would ');
  var person = personEffect[0];
  var directionMagnitude = personEffect[1].split(' ');
  var direction = directionMagnitude[0] === 'gain' ? 1 : -1;
  var magnitude = Number.parseInt(directionMagnitude[1]);
  var effectOnPerson = direction * magnitude;
  var neighbor = headNeighbor[1].slice(0,-1); // trim trailing .
  addEffect(person, neighbor, effectOnPerson);
}
var inputs = document.body.innerText.split('\n');
for (var i = 0; i < inputs.length; i++) {
  parseLine(inputs[i]);
}

function neighborEffect(a, b) {
  return effect[a][b] + effect[b][a];
}
function bestEffect(currentEffect, seated, unseated, partb) {
  if (unseated.length < 1) {
    if (partb) { // insert myself for no effect between ends
      return currentEffect;
    }
    // close loop at each end
    return currentEffect + neighborEffect(seated[0], seated[seated.length-1]);
  }
  var best = -Infinity;
  var j;
  for (j = 0; j<unseated.length; j++) {
    var nextEffect = (seated.length === 0) ? 0 : neighborEffect(seated[seated.length-1], unseated[j]);
    var nextSeated = seated.slice(0);
    nextSeated.push(unseated[j]);
    var nextUnseated = unseated.slice(0);
    nextUnseated.splice(j, 1);
    best = Math.max(best, bestEffect(currentEffect + nextEffect, nextSeated, nextUnseated, partb));
  }
  return best;
}

var allGuests = Object.keys(effect);
console.log(bestEffect(0, [], allGuests));

// part b
console.log(bestEffect(0, [], allGuests, true));
