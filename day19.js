// problem: http://adventofcode.com/day/19
// input: http://adventofcode.com/day/19/input

/**
 * @param s string mapping formatted as 'atom => molecule'
 * @param replacements input Object multimap from atom to array of molecules
 * @return replacements with added mapping from s
 */
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
var medicine;
for (var i = 0; i < inputs.length; i++) {
  var line = inputs[i];
  if (!line) { continue; }
  if (line.indexOf(' => ') >= 0) {
    inputReplacements = readReplacementLine(line, inputReplacements);
  } else {
    medicine = line;
    console.log(transforms(line, inputReplacements).length);
  }
}

// part b
testReplacements = readReplacementLine('e => H', testReplacements);
testReplacements = readReplacementLine('e => O', testReplacements);

/**
 * @param arr array of strings to be modified
 * @param maxLen maximum length of string to keep
 * @return arr without any strings longer than maxLen
 */
function filterLength(arr, maxLen) {
  for (var i = arr.length; i-->0; ) {
    if (arr[i].length > maxLen) {
      arr.splice(i, 1); // delete from array
    }
  }
  return arr;
}
/**
 * @param candidate to compare to target
 * @param target desired match
 * @return quantity of candidate elements from both ends which match their corresponding target element
 *         or candidate.length when all candidate elements match corresponding target elements
 */
function matchLength(candidate, target) {
  var i = 0;
/*
  for (i = 0; i < candidate.length; ) {
    if (candidate[i] !== target[i]) {
      break;
    }
    i++;
  }
*/
  var j;
  for (j = 0; j < candidate.length - i && j < target.length - i; ) {
    if (candidate[candidate.length-1-j] !== target[target.length-1-j]) {
      break;
    }
    j++;
  }
  return i + j;
}
/**
 * @return comparator function (suitable for use with Array.sort or priority_queue)
 *         with items assumed to be arrays of size 3, [string, step number, target match length]
 *         which compares first by length of target match (more is better), 
 *         then by absolute length (shorter is better), 
 *         then by natural order
 *         and finally by step number (fewer is better)
 */
function targetComparator(target) {
  return function(a, b) {
    var aStr = a[0];
    var bStr = b[0];
    var aStep = a[1];
    var bStep = b[1];
    if (aStr === bStr) {
      if (aStep === bStep) {
        return 0; 
      }
      return aStep - bStep; // fewer steps are better
    }
    var aMatch = a[2];
    var bMatch = b[2];
    if (aMatch != bMatch) { return bMatch - aMatch; } // more match is better
    if (aStr.length != bStr.length) { return aStr.length - bStr.length; } // shorter is better
    return (aStr < bStr) ? -1 : 1; // lexicographic order
  };
}
// use priority queue from https://github.com/agnat/js_priority_queue/blob/master/priority_queue.js
var useMap = true;
function steps(target, replacements, limit) {
  limit = limit || 10;
  var cmp = targetComparator(target);
  var q = [];
  var pq = new priority_queue.PriorityQueue(cmp, q);
  pq.push(['e', 0]);
  var map = {};
  var seenit = 0;
  var next;
  var bestMatch;
  var bestMatchLength = 0;
  var i = 0;
  while (next = pq.shift()) {
    var input = next[0];
    if (++i % 100000 == 0) {
      console.log('Checking: ' + input + '.\tpq size ' + q.length);
    }
    var step = next[1] + 1;
    if (step > limit) {
      continue;
    }
    var inputMatchLength = next[2];
    if (inputMatchLength < bestMatchLength - 10) { // limit backtracking
      continue;
    }
    var output = transforms(input, replacements);
    // transforms stay the same or grow longer, therefore excess length is a dead end
    output = filterLength(output, Math.min(target.length, bestMatchLength + 15));
    // console.log(input + ' generates: ' + output.join(','));
    for (var j = 0; j < output.length; j++) {
      var oj = output[j];
      if (oj === target) {
        // console.log(map);
        return step;
      }
      if (useMap) {
        if (step >= map[oj]) {
          if (++seenit % 100000 == 0) {
            console.log('Map pruned ' + seenit + ' explorations, using ' + Object.keys(map).length + ' entries');
          }
          continue;
        }
        map[oj] = step;
      }
      var ojMatchLength = matchLength(oj, target);
      if (ojMatchLength > bestMatchLength) {
        bestMatchLength = ojMatchLength;
        bestMatch = oj;
        console.log(['Best match:', bestMatch, 'length:', bestMatchLength, 'step:', step].join(' '));
      }
      pq.push([oj, step, ojMatchLength]);
    }
  }
  if (useMap) { console.log('Map pruned ' + seenit + ' explorations, using ' + Object.keys(map).length + ' entries'); }
  return bestMatch;
}
// console.log(steps('HOHOHO', inputReplacements, 10));
var testReductions = [['HH','O'], ['HO','H'], ['OH','H'], ['O','e'], ['H','e']];
function reduce(input, reductions, reduceMap, limit) {
  if (limit === undefined) {
    limit = 10;
  }
  if (reduceMap === undefined) {
    reduceMap = {};
  }
  var minReduce = Infinity;
  var wordCountQueue = [[input, 0]];
  var c = 0;
  while (wordCountQueue.length > 0) {
    var wordCount = wordCountQueue.pop();
    var count = wordCount[1];
    if (count >= minReduce) {
      continue; 
    }
    var word = wordCount[0];
    if (word === 'e') {
      minReduce = count;
      console.log('Path found! ' + minReduce);
      continue;
    }
    var nextCount = count + 1;
    if (nextCount > limit) {
      continue;
    }
    var nextWords = nextReductions(word, reductions);
    for (var i=0; i<nextWords.length; i++) {
      var nextWord = nextWords[i];
      var existingCount = reduceMap[nextWord];
      if (nextCount >= existingCount) {
        continue;
      }
      reduceMap[nextWord] = nextCount;
      wordCountQueue.push([nextWord, nextCount]);
    }
    if (c++ % 1000 === 0) {
      console.log('queue length ' + wordCountQueue.length);
    }
  }
  return minReduce;
}
function nextReductions(word, reductions) {
  var result = [];
  for (var i = 0; i < reductions.length; i++) {
    var target = Object.keys(reductions[i])[0];
    var replacement = reductions[i][target];
    var wordHead = word;
    var index;
    while ((index = wordHead.lastIndexOf(target)) >= 0) {
      var replaced = word.split("");
      replaced.splice(index, target.length, replacement);
      replaced = replaced.join("");
      result.push(replaced);
      wordHead = word.substring(0, index);
    }
  }
  return shuffle(result);
}
function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function readReductionLine(s) {
  if (!s || s.indexOf(' => ') < 0) { return null; }
  var atomMolecule = s.split(' => ');
  return atomMolecule.reverse();
}
var inputReductions = [];
for (var i = 0; i < inputs.length; i++) {
  var reduction = readReductionLine(inputs[i]);
  if (reduction) {
    inputReductions.push(reduction);
  }
}
inputReductions.sort(function(a, b) {
  var aMolecule = a[0];
  var bMolecule = b[0];
  if (aMolecule.length === bMolecule.length) {
    var aAtom = a[1];
    var bAtom = b[1];
    return aAtom.length > bAtom.length ? 1 : aAtom.length < bAtom.length ? -1 : 0;
  }
  return aMolecule.length > bMolecule.length ? -1 : 1;
});
function rreduce(input, reductions, limit) {
  limit = limit || 250;
  var count = 0;
  var s = input;
  while (count < limit && s !== 'e') {
    var maxRight = -Infinity;
    var bestReduction = undefined;
    var bestIndex = undefined;
    for (var i = 0; i < reductions.length; i++) {
      var reduction = reductions[i];
      var molecule = reductions[i][0];
      var moleculeIndex = s.lastIndexOf(molecule);
      if (moleculeIndex >= 0) {
        var moleculeRight = moleculeIndex + molecule.length;
        if (moleculeRight > maxRight) {
          maxRight = moleculeRight;
          bestReduction = reduction;
          bestIndex = moleculeIndex;
          // console.log(s + ' best is ' + bestReduction);
        }
      }
    }
    if (bestReduction === undefined) {
      console.log('No reductions');
      break;
    }
    var arr = s.split("");
    arr.splice(bestIndex, bestReduction[0].length, bestReduction[1]);
    s = arr.join("");
    count++;
  }
  // console.log(count, s);
  return count;
}
console.log(rreduce(medicine, inputReductions));

function isUpper(c) {
  return c === c.toUpperCase();
}
function atomize(s) {
  var result = [];
  if (!s) return result;
  var atom = s[0];
  for (var i = 1; i < s.length; i++) {
    if (isUpper(s[i])) { // new element begins with capital letter
      result.push(atom);
      atom = s[i];
    } else { // continue existing element name
      atom += s[i];
    }
  }
  return result;
}
/** @return true iff all array elements are in the set */
function allIn(arr, set) {
  for (var i = 0; i < arr.length; i++) {
    if (!set.has(arr[i])) {
      return false;
    }
  }
  return true;
}
/** @return new Object with only relevant replacements */
function filterReplacements(replacements, target) {
  var result = {};
  var ras = Object.keys(replacements);
  var usefulSet = new Set(ras.concat(atomize(target)));
  for (ra in replacements) {
    var rms = replacements[ra];
    for (var j = 0; j < rms.length; j++) {
      var rm = rms[j];
      var rmAtoms = [...(new Set(atomize(rm)))]; // dedupe atoms
      if (allIn(rmAtoms, usefulSet)) {
        if (result[ra] === undefined) {
          result[ra] = [];
        }
        result[ra].push(rm);
      }
    }
  }
  return result;
}
var filteredReplacements = filterReplacements(inputReplacements, medicine);


// use priority queue from https://github.com/agnat/js_priority_queue/blob/master/priority_queue.js
(function() { // namespace

var exports = (typeof module !== 'undefined' && module.exports) ?
    module.exports : window.priority_queue = {};

exports.PriorityQueue = function PriorityQueue(compare, queue) {
  if (!(this instanceof PriorityQueue)) return new PriorityQueue(compare, queue);

  compare = compare || min_first;
  queue   = queue   || [];

  function swap(i, j) { var t = queue[i]; queue[i] = queue[j]; queue[j] = t; }

  function heapify(i) {
    var length = queue.length, x, l, r;
    while (true) {
      x = i; l = left(i); r = right(i);
      if (l < length && compare(queue[l], queue[x]) < 0) x = l;
      if (r < length && compare(queue[r], queue[x]) < 0) x = r;
      if (x === i) break;
      swap(i, x);
      i = x;
    }
  }

  function remove(i) {
    var t = queue[i], b = queue.pop();
    if (queue.length > 0) {
      queue[i] = b;
      heapify(i);
    }
    return t;
  }

  this.push = function push(/* element, ... */) {
    var i = queue.length, e = i + arguments.length, j, p;
    queue.push.apply(queue, arguments);
    for (; i < e; ++i) {
      j = i; p = parent(i);
      for (; j > 0 && compare(queue[j], queue[p]) < 0; j = p, p = parent(j)) {
        swap(j, p);
      }
    }
    return queue.length;
  }

  this.shift = function shift() { return remove(0); }
  this.__defineGetter__('length', function length() { return queue.length });

  for (var i = parent(queue.length - 1); i >= 0; --i) { heapify(i) }
}

function left(i)   { return 2 * i + 1 }
function right(i)  { return 2 * i + 2 }
function parent(i) { return Math.floor((i + 1) / 2) - 1 }

var max_first = exports.max_first = function max_first(a, b) { return b - a }
  , min_first = exports.min_first = function min_first(a, b) { return a - b }
  ;

})(); // end of namespace 

// Best match: ORnPBPMgArCaCaCaSiThCaCaSiThCaCaPBSiRnFArRnFArCaCaSiThCaCaSiThCaCaCaCaCaCaSiRnFYFArSiRnMgArCaSiRnPTiTiBFYPBFArSiRnCaSiRnTiRnFArSiAlArPTiBPTiRnCaSiAlArCaPTiTiBPMgYFArPTiRnFArSiRnCaCaFYFArF	77
// console.log(steps(medicine, inputReplacements, 500))
