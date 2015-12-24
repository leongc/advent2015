// problem: http://adventofcode.com/day/24
// input: http://adventofcode.com/day/24/input

var testInput = [1,2,3,4,5,7,8,9,10,11];
function getInput() {
  var result = [];
  var inputs = document.body.innerText.split('\n');
  for (var i=0; i<inputs.length; i++) {
    var line = inputs[i];
    if (!line) { continue; }
    result.push(parseInt(line));
  }
  return result;
}
function sum(numbers) {
  var result = 0;
  for (var i=0; i<numbers.length; i++) {
    result += numbers[i];
  }
  return result;
}
function qe(numbers) {
  var result = 1;
  for (var i=0; i<numbers.length; i++) {
    result *= numbers[i];
  }
  return result;
}
function canSum(numbers, targetSum) {
  if (targetSum === 0) {
    return true;
  }
  if (!numbers || targetSum < 0) {
    return false;
  }
  for (var i=numbers.length; i-->0; ) {
    var nextNumbers = numbers.slice(0); // clone
    nextNumbers.splice(i, 1);
    var nextTargetSum = targetSum - numbers[i];
    if (canSum(nextNumbers, nextTargetSum)) {
      return true;
    }
  }
  return false;
}
/**
 * @param numbers array of positive integers to be partitioned
 * @param code binary encoding of the proposed partition of numbers
 * @param targetSum required sum of the first partition of numbers
 * @return false if partitioned numbers do not sum to targetSum, otherwise
 *         a pair of arrays
 *         [[partitioned numbers according to code], [remaining numbers]]
 */
function partition(numbers, code, targetSum) {
  var result = [[],[]];
  var s = 0;
  for (var i = numbers.length; i-->0; ) {
    var n = numbers[i];
    if (code & 1) {
      result[0].unshift(n);
      s += n;
      if (s > targetSum) {
        return false;
      }
    } else {
      result[1].unshift(n);
    }
    code = code >>> 1;
  }
  if (s !== targetSum) {
    return false;
  }
  return result;
}
function excessBits(code, minBits) {
  if (minBits === undefined) { return false; }
  var result = 0;
  while (code > 0) {
    if ((code & 1) && (++result > minBits)) {
      return true;
    }
    code = code >>> 1;
  }
  return false;
}
function loadSleigh(numbers) {
  var targetSum = sum(numbers)/3;
  var minQe = Infinity;
  var minBits = undefined;
  var maxCode = 1 << numbers.length;
  for (var code = 1; code < maxCode; code++) {
    if (excessBits(code, minBits)) { continue; } 
    var parts = partition(numbers, code, targetSum);
    if (!parts) { continue; }
    if (canSum(parts[1], targetSum)) {
      if (minBits === undefined || parts[0].length < minBits) {
        minBits = parts[0].length;
        minQe = qe(parts[0]);
      } else {
        minQe = Math.min(minQe, qe(parts[0]));
      }
      console.log(minQe + ' = ' + parts[0].join(','));
    }
  }
  return minQe;
}

// part b
function canThird(numbers, targetSum) {
  if (targetSum === undefined) {
    targetSum = sum(numbers)/3;
  }
  var maxCode = 1 << numbers.length;
  for (var code = 1; code < maxCode; code++) {
    var parts = partition(numbers, code, targetSum);
    if (!parts) { continue; }
    if (canSum(parts[1], targetSum)) {
      return true;
    }
  }
  return false;
}
function loadSleighTrunk(numbers) {
  var targetSum = sum(numbers)/4;
  var minQe = Infinity;
  var minBits = undefined;
  var maxCode = 1 << numbers.length;
  for (var code = 1; code < maxCode; code++) {
    if (excessBits(code, minBits)) { continue; } 
    var parts = partition(numbers, code, targetSum);
    if (!parts) { continue; }
    if (canThird(parts[1], targetSum)) {
      if (minBits === undefined || parts[0].length < minBits) {
        minBits = parts[0].length;
        minQe = qe(parts[0]);
      } else {
        minQe = Math.min(minQe, qe(parts[0]));
      }
      console.log(minQe + ' = ' + parts[0].join(','));
    }
  }
  return minQe;
}
console.log(loadSleigh(getInput()));
console.log(loadSleighTrunk(getInput()));
