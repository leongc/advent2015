// problem: http://adventofcode.com/day/19
// input: http://adventofcode.com/day/19/input

function readReplacementLine(s, replacements) {
  if (!s) { return replacements; }
  var inOut = s.split(' => ');
  var original = inOut[0];
  var replacement = inOut[1];
  if (replacements[original] === undefined) {
    replacements[original] = [];
  }
  replacements[original].push(replacement);
  return replacements;
}
var testReplacements = {};
testReplacements = readReplacementLine('H => HO', testReplacements);
testReplacements = readReplacementLine('H => OH', testReplacements);
testReplacements = readReplacementLine('O => HH', testReplacements);
function transforms(source, replacements) {
  var multiset = {}; // replacement => count
  for (var i = 0; i < source.length; i++) {
    var match = null;
    if (replacements[source[i]] !== undefined) {
      match = source[i];
    } else if ((i < source.length-1) && replacements[source.slice(i, i+2)] !== undefined) {
      match = source.slice(i, i+2);
    } else {
      continue;
    }
    for (var j = 0; j < replacements[match].length; j++) {
      var cloneSource = source.split(""); // array of chars
      cloneSource.splice(i, match.length, replacements[match][j]);
      var replaced = cloneSource.join("");
      if (multiset[replaced] === undefined) {
        multiset[replaced] = 1;
      } else {
        multiset[replaced]++;
      }
    }
  }
  return multiset;
}
var inputs = document.body.innerText.split('\n');
var inputReplacements = {};
for (var i = 0; i < inputs.length; i++) {
  var line = inputs[i];
  if (!line) { continue; }
  if (line.indexOf(' => ') >= 0) {
    inputReplacements = readReplacementLine(line, inputReplacements);
  } else {
    console.log(Object.keys(transforms(line, inputReplacements)).length);
  }
}
