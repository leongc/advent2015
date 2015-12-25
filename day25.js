// problem: http://adventofcode.com/day/25
// input: http://adventofcode.com/day/25/input
// row 2978, column 3083

function sumTo(n) {
  var result = 0;
  for (var i = 1; i <= n; i++) {
    result += i;
  }
  return result;
}
    
function ordinal(row, col) {
  if (col === 1) {
    return sumTo(row-1)+1;
  }
  return ordinal(row + col - 1, 1) + (col - 1);
}

function step(n) {
  var result = 20151125;
  for (var i = 1; i < n; i++) {
    var product = result * 252533;
    result = product % 33554393;
  }
  return result;
}

console.log(step(ordinal(2978, 3083)));
