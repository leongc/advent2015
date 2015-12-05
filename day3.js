// problem: http://adventofcode.com/day/3
// input: http://adventofcode.com/day/3/input
var input = document.body.innerText;
var visited = { "0,0": 1 };
var x = 0;
var y = 0;
for (i = 0; i < input.length; i++) {
  if (input[i] == '^') {
    y++; 
  } else if (input[i] == 'v') {
    y--;
  } else if (input[i] == '<') {
    x--;
  } else if (input[i] == '>') {
    x++;
  } else {
    continue;
  }
  var coordinate = x + "," + y;
  if (visited[coordinate] === undefined) {
    visited[coordinate] = 1;
  }
}
console.log(keys(visited).length);
