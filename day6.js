// problem: http://adventofcode.com/day/6
// input: http://adventofcode.com/day/6/input
function parseInstruction(s) {
  var result = new Object();
  if (s.startsWith("turn on")) {
    result.op = 1;
    s = s.substr(7);
  } else if (s.startsWith("turn off")) {
    result.op = 0;
    s = s.substr(8);
  } else if (s.startsWith("toggle")) {
    result.op = '^';
    s = s.substr(6);
  } else {
    return null;
  }
  var t = s.split(" through ");
  result.upperLeft = parsePair(t[0]);
  result.lowerRight = parsePair(t[1]);
  return result;
}
function parsePair(p) {
  var u = p.split(",");
  return { x: parseInt(u[0]), y: parseInt(u[1]) };
}
function gridSum(g) {
  var sum = 0;
  var xkeys = Object.keys(g);
  for (var j = 0; j < xkeys.length; j++) {
    var ykeys = Object.keys(g[j]);
    for (var k = 0; k < ykeys.length; k++) {
      sum += g[xkeys[j]][ykeys[k]];
    }
  }
  return sum;
}
function apply1(instruction, grid) {
  if (instruction == null) { return grid; }
  for (var x = instruction.upperLeft.x; x <= instruction.lowerRight.x; x++) {
    for (var y = instruction.upperLeft.y; y<= instruction.lowerRight.y; y++) {
      if (instruction.op == '^') {
        grid[x][y] ^= 1;
      } else {
        grid[x][y] = instruction.op;
      }
    }
  }
  return grid;
}
function apply2(instruction, grid) {
  if (instruction == null) { return grid; }
  for (var x = instruction.upperLeft.x; x <= instruction.lowerRight.x; x++) {
    for (var y = instruction.upperLeft.y; y<= instruction.lowerRight.y; y++) {
      if (grid[x][y] == undefined) {
        grid[x][y] = 0;
      }
      if (instruction.op == '^') {
        grid[x][y] += 2 ;
      } else if (instruction.op == 1) {
        grid[x][y]++;
      } else if (instruction.op == 0 && grid[x][y] > 0) {
        grid[x][y]--;
      }
    }
  }
  return grid;
}
function newGrid(x, y) {
  var grid = new Array(x);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(y);
  }
  return grid;
}
var grid1 = newGrid(1000, 1000);
var grid2 = newGrid(1000, 1000);
var input = document.body.innerText.split('\n');
for (var m = 0; m < input.length; m++) {
  var instr = parseInstruction(input[m]);
  apply1(instr, grid1);
  apply2(instr, grid2);
}
console.log(gridSum(grid1));
console.log(gridSum(grid2));
