// problem: http://adventofcode.com/day/18
// input: http://adventofcode.com/day/18/input

var testGrid = [
  [0,1,0,1,0,1],
  [0,0,0,1,1,0],
  [1,0,0,0,0,1],
  [0,0,1,0,0,0],
  [1,0,1,0,0,1],
  [1,1,1,1,0,0]
];
function neighborSum(x, y, grid) {
  var sum = 0;
  for (var i = x-1; i <= x+1; i++) {
    for (var j = y-1; j <= y+1; j++) {
      if (0 <= i && i < grid[0].length && 
          0 <= j && j < grid.length && 
          (i !== x || j !== y) && // exclude self
          grid[i][j] === 1) {
        sum++;
      }
    }
  }
  return sum;
}
function printGrid(grid) {
  for (var x = 0; x < grid.length; x++) {
    var line = "";
    for (var y = 0; y < grid[x].length; y++) {
      line += (grid[x][y] === 1) ? '#' : '.';
    }
    console.log(line);
  }
}
function nextLight(x, y, grid) {
  var n = neighborSum(x, y, grid);
  return ((n === 3) || (n === 2 && grid[x][y] === 1)) ? 1 : 0;
}
function fixCorners(grid) {
  var max = grid.length - 1;
  var may = grid[0].length - 1;
  grid[0][0] = 1;
  grid[0][may] = 1;
  grid[max][0] = 1;
  grid[max][may] = 1;
  return grid;
}
function nextGrid(grid, fix) {
  var next = grid.slice(0); // clone x arrays
  for (var x = 0; x < grid.length; x++) {
    next[x] = grid[x].slice(0); // clone y array
    for (var y = 0; y < grid[x].length; y++) {
      next[x][y] = nextLight(x, y, grid);
    }
  }
  if (fix) {
    next = fixCorners(next);
  }
  return next;
}
function gridSum(grid) {
  var sum = 0;
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === 1) {
        sum++;
      }
    }
  }
  return sum;
}
function loopGrid(grid, steps, fix) {
  var result = grid;
  for (var i = 0; i < steps; i++) {
    result = nextGrid(result, fix);
  }
  return result;
}
function readLine(s) {
  if (!s) { return null; }
  var line = [];
  for (var i = 0; i < s.length; i++) {
    if (s[i] === '#') {
      line.push(1);
    } else if (s[i] === '.') {
      line.push(0);
    }
  }
  return line;
}
function inputGrid() {
  var grid = [];
  var inputs = document.body.innerText.split('\n');
  for (var i = 0; i < inputs.length; i++) {
    var line = readLine(inputs[i]);
    if (line) {
      grid.push(line);
    }
  }
  return grid;
}
console.log(gridSum(loopGrid(inputGrid(), 100)));

console.log(gridSum(loopGrid(fixGrid(inputGrid()), 100, true)));
