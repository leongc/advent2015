// problem: http://adventofcode.com/day/2
// input: http://adventofcode.com/day/2/input
var input = document.body.innerText.split('\n');
var areasum = 0;
var ribbonsum = 0;
for (i = 0; i < input.length; i++) {
  var side = input[i].split('x');
  if (side.length < 3) { continue; }
  var side0 = parseInt(side[0]);
  var side1 = parseInt(side[1]);
  var side2 = parseInt(side[2]);
  var face1 = side0 * side1;
  var face2 = side1 * side2;
  var face3 = side0 * side2;
  var minFace = Math.min(face1, face2, face3);
  areasum += (2*face1) + (2*face2) + (2*face3) + minFace;
  
  var sum01 = side0 + side1;
  var sum12 = side1 + side2;
  var sum02 = side0 + side2;
  var minPerimeter = 2 * Math.min(sum01, sum12, sum02);
  var volume = side0 * side1 * side2;
  ribbonsum += minPerimeter + volume;
}
console.log(areasum);
console.log(ribbonsum);
