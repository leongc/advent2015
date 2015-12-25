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
 * @return lowest index of candidate element which differs from corresponding target element
 *         or candidate.length when all candidate elements match corresponding target elements
 */
function matchLength(candidate, target) {
  for (var i = 0; i < candidate.length; i++) {
    if (candidate[i] !== target[i]) {
      return i;
    }
  }
  return candidate.length;
}
/**
 * @return comparator function (suitable for use with Array.sort or priority_queue)
 *         with items assumed to be arrays of size 2, [string, step number]
 *         which compares first by length of target match (more is better), 
 *         then by absolute length (shorter is better), 
 *         then by natural order
 *         and finally by step number (fewer is better)
 */
function targetComparator(target) {
  return function(a, b) {
    if (a[0] === b[0]) {
      if (a[1] === b[1]) {
        return 0; 
      }
      return a[1] - b[1]; // fewer steps are better
    }
    var aMatch = matchLength(a[0], target);
    var bMatch = matchLength(b[0], target);
    if (aMatch != bMatch) { return bMatch - aMatch; } // more match is better
    if (a[0].length != b[0].length) { return a[0].length - b[0].length; } // shorter is better
    return (a[0] < b[0]) ? -1 : 1; // lexicographic order
  };
}
// use priority queue from https://github.com/agnat/js_priority_queue/blob/master/priority_queue.js
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
    if (++i % 100000 == 0) {
      console.log('Checking: ' + input + '.\tpq size ' + q.length);
    }
    var input = next[0];
    var step = next[1] + 1;
    if (step > limit) {
      continue;
    }
    var inputMatchLength = matchLength(input, target);
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
      if (step >= map[oj]) {
        if (++seenit % 1000000 == 0) {
          console.log('Map saved ' + seenit + ' lookups');
        }
        continue;
      }
      map[oj] = step;
      var curMatchLength = matchLength(oj, target);
      if (curMatchLength > bestMatchLength) {
        bestMatchLength = curMatchLength;
        bestMatch = oj;
        console.log('Best match: ' + oj + '\t' + step);
      }
      pq.push([oj, step]);
    }
    // TODO: peek at the bottom of the pq
    // and conditionally remove based on the bestMatchLength
  }
  return bestMatch;
}
// console.log(steps('HOHOHO', inputReplacements, 10));

/*
var testReductions = [{'HH':'O'}, {'HO':'H'}, {'OH':'H'}, {'O':'e'}, {'H':'e'}];
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
  return result;
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
*/
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
