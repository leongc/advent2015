// problem: http://adventofcode.com/day/20
// input: 33100000

function presents(i) {
  var sum = 0;
  for (var j=1; j<=Math.sqrt(i); j++) {
    if (i % j == 0) {
      sum += j;
      if (Math.pow(j, 2) !== i) { // only count sqrt once
        sum += i/j; // opposite pair
      }
    }
  }
  return 10 * sum;
}
var target = 33100000;
var x = 10;
while (presents(x) < target) {
  x++;
}
console.log(x);

// part b
function presents50(i) {
  var sum = 0;
  for (var j=1; j<=Math.sqrt(i); j++) {
    if (i % j == 0) {
      if (i <= (50 * j)) {
        sum += j;
      }
      if (i <= (50 * i / j) && Math.pow(j, 2) !== i) {
        sum += i/j;
      }
    }
  }
  return 11 * sum;
}
var x = 1;
while (presents50(x) < target) {
  x++;
}
console.log(x);
