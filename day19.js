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
  var multiset = {}; // replacement => 1
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
      }
    }
  }
  return Object.keys(multiset);
}
var inputs = document.body.innerText.split('\n');
var inputReplacements = {};
for (var i = 0; i < inputs.length; i++) {
  var line = inputs[i];
  if (!line) { continue; }
  if (line.indexOf(' => ') >= 0) {
    inputReplacements = readReplacementLine(line, inputReplacements);
  } else {
    console.log(transforms(line, inputReplacements).length);
  }
}

// part b
var stepReplacements = {
  'e': ['H', 'O'],
  'H': ['HO', 'OH'],
  'O': ['HH']
};
function steps(target, replacements, limit) {
  var step = 0;
  var input = ['e'];
  if (limit === undefined) {
    limit = 10;
  }
  var map = {};
  while (++step < limit) {
    var candidates = [];
    for (var i = 0; i < input.length; i++) {
      var output = transforms(input[i], replacements);
      for (var j = 0; j < output.length; j++) {
        if (output[j] === target) {
          return step;
        } else if (output[j].length > target.length) {
          continue; // transforms stay the same or grow longer, so this is a dead end
        } else if (map[output[j]] === undefined) {
          map[output[j]] = step;
          candidates.push(output[j]);
        } 
      }
    }
    input = candidates.slice(0);
  }
  return map;
}
// console.log(steps('HOHOHO', inputReplacements, 10));

var testReductions = [{'HH':'O'}, {'HO':'H'}, {'OH':'H'}, {'O':'e'}, {'H':'e'}];
function reduce(input, reductions, count, reduceMap, limit) {
  if (count === undefined) {
    count = 0;
  }
  if (limit === undefined) {
    limit = 10;
  }
  if (reduceMap === undefined) {
    reduceMap = {};
  }
  if (count >= limit) {
    // console.log("gave up on " + input + " after " + count);
    return Infinity;
  }
  var minReduce = Infinity;
  var replaced = input;
  for (var i = 0; i < reductions.length; i++) {
    var target = Object.keys(reductions[i])[0];
    var index = input.indexOf(target);
    if (index >= 0) {
      var replacement = reductions[i][target];
      replaced = input.split("");
      replaced.splice(index, target.length, replacement);
      if (replaced === "") {
        return minReduce; // dead-end
      }
      replaced = replaced.join("");
      if (replaced === 'e') {
        return count + 1;
      } 
      if ((count + 1) > minReduce) {
        return minReduce; // longer than known solution
      }
      var replacementCost = reduceMap[replaced];
      if (replacementCost !== undefined) {
        return minReduce; // already checked
      } 
      reduceMap[replaced] = count + 1;
      minReduce = Math.min(minReduce, reduce(replaced, reductions, count + 1, reduceMap, limit));
    }
  }
  return minReduce;
}
function readReductionLine(s) {
  if (!s || s.indexOf(' => ') < 0) { return null; }
  var inOut = s.split(' => ');
  var original = inOut[0];
  var replacement = inOut[1];
  var reduction = {};
  reduction[replacement] = original;
  return reduction;
}
var inputReductions = [];
for (var i = 0; i < inputs.length; i++) {
  var reduction = readReductionLine(inputs[i]);
  if (reduction) {
    inputReductions.push(reduction);
  }
}
inputReductions.sort(function(a, b) {
  var ka = Object.keys(a)[0];
  var kb = Object.keys(b)[0];
  if (ka.length === kb.length) {
    var va = a[ka];
    var vb = b[kb];
    return va.length > vb.length ? 1 : va.length < vb.length ? -1 : 0;
  }
  return ka.length > kb.length ? -1 : 1;
});
// console.log(reduce(inputs[inputs.length-2], inputReductions, 0, {}, 30));
