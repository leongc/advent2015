// problem: http://adventofcode.com/day/17
// input: http://adventofcode.com/day/17/input
var testCapacities = [5, 5, 10, 15, 20];
var inputs = document.body.innerText.split('\n');
var capacities = [];
for (var i=0; i<inputs.length; i++) {
  var s = inputs[i];
  if (s) {
    capacities.push(parseInt(s));
  }
}
function isTarget(counter, capacities, target) {
  var sum = 0;
  for (var j = 0; j<capacities.length; j++) {
    if ((1 << j) & counter) {
      sum += capacities[j];
      if (sum > target) {
        return false;
      }
    }
  }
  return sum === target;
}
function loop(target, capacities) {
  var combos = 0;
  var top = 1 << capacities.length;
  for (var i = 1; i < top; i++) {
    if (isTarget(i, capacities, target)) {
      combos++;
    }
  }
  return combos;
}

console.log(loop(150, capacities));
