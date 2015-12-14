// problem: http://adventofcode.com/day/14
// input: http://adventofcode.com/day/14/input

var reindeer = {}
function parseLine(s) {
  if (!s) {
    return null;
  }
  var nameTail = s.split(' can fly ');
  var name = nameTail[0];
  var speedTail = nameTail[1].split(' km/s for ');
  var speed = parseInt(speedTail[0]);
  var enduranceTail = speedTail[1].split(' seconds, but then must rest for ');
  var endurance = parseInt(enduranceTail[0]);
  var recoveryTail = enduranceTail[1].split(' seconds.');
  var recovery = parseInt(recoveryTail[0]);
  return {
    name: name,
    speed: speed,
    endurance: endurance,
    recovery: recovery
  };
}
var inputs = document.body.innerText.split('\n');
for (var i=0; i<inputs.length; i++) {
  var r = parseLine(inputs[i]);
  if (r) {
    reindeer[r.name] = r;
  }
}

function getDistance(r, t) {
  var x = 0;
  var period = r.endurance + r.recovery;
  for (var i = 0; i < t; ) {
    if ((i % period) < r.endurance) {
      x += r.speed;
      i++;
    } else {
      i += r.recovery; 
    }
  }
  return x;
}
function raceAll(t) {
  var maxDistance = 0;
  var names = Object.keys(reindeer);
  for (var j = 0; j < names.length; j++) {
    maxDistance = Math.max(maxDistance, getDistance(reindeer[names[j]], t));
  }
  return maxDistance;
}
console.log(raceAll(2503));

// part b
function reset() {
  this.distance = 0;
  this.clock = 0;
  this.points = 0;
}
function tick() {
  this.clock++;
  if (this.clock % (this.endurance + this.recovery) < this.endurance) {
    this.distance += this.speed;
  }
  return this.distance;
}
function score(distance) {
  if (this.distance === distance) {
    this.points++;
  }
  return this.points;
}
function enhanceReindeer(r) {
  if (r.reset === undefined) {
    r.reset = reset;
  }
  if (r.tick === undefined) {
    r.tick = tick;
  }
  if (r.score === undefined) {
    r.score = score;
  }
  return r;
}
function enhanceAll() {
  var names = Object.keys(reindeer);
  for (var k=0; k<names.length; k++) {
    reindeer[names[k]] = enhanceReindeer(reindeer[names[k]]);
  }
}
function tickAll() {
  var names = Object.keys(reindeer);
  var maxDistance = 0;
  for (var k=0; k<names.length; k++) {
    maxDistance = Math.max(maxDistance, reindeer[names[k]].tick());
  }
  return maxDistance;
}
function scoreAll(d) {
  var names = Object.keys(reindeer);
  var maxPoints = 0;
  for (var k=0; k<names.length; k++) {
    maxPoints = Math.max(maxPoints, reindeer[names[k]].score(d));
  }
  return maxPoints;
}
function resetAll() {
  var names = Object.keys(reindeer);
  for (var k=0; k<names.length; k++) {
    reindeer[names[k]].reset();
  }
}
function raceAllLead(t) {
  enhanceAll();
  resetAll();
  var maxDistance = 0;
  var maxScore = 0;
  var names = Object.keys(reindeer);
  for (var u=0; u<t; u++) {
    maxDistance = tickAll();
    maxScore = scoreAll(maxDistance);
  }
  return maxScore;
}
console.log(raceAllLead(2503));
