// problem: http://adventofcode.com/day/7
// input: http://adventofcode.com/day/7/input

var input = document.body.innerText.split('\n');
var inputs = {}; // wire to (input) operator and operands or value 
var outputs = {}; // wire to list of wires to notify when a value for this wire is available
function tryNumber(s) {
  var n = Number.parseInt(s);
  return isNaN(n) ? s : n
}
function parseInput(lhs) {
  if (!lhs) {
    return null;
  }
  var result = {};
  var words = lhs.split(' ');
  if (words[0] === 'NOT') {
    result.operator = 'NOT';
    result.operand = tryNumber(words[1]);
  } else if (words[1] === 'LSHIFT' || words[1] === 'RSHIFT' || words[1] === 'AND' || words[1] === 'OR') {
    result.operator = words[1];
    result.operand1 = tryNumber(words[0]);
    result.operand2 = tryNumber(words[2]);
  } else {
    result.operator = 'EQ';
    result.operand = tryNumber(words[0]);
  }
  return result;
}
function tryLookup(maybeSymbol) {
  if (typeof maybeSymbol === 'number') {
    return maybeSymbol;
  }
  // see if this symbol resolves to a value
  if (typeof inputs[maybeSymbol] === 'number') {
    return inputs[maybeSymbol];
  }
  return maybeSymbol;
}
function appendOutput(rh, operand) {
  if (outputs[operand] == null) {
    outputs[operand] = [rh];
  } else {
    outputs[operand].push(rh);
  }
}
function evalInput(lh, rh, append) {
  var notify = false;
  if (lh.operator === 'EQ') {
    lh.operand = tryLookup(lh.operand);
    if (typeof lh.operand === 'number') {
      inputs[rh] = lh.operand;
      notify = true;
    } else if (append) {
      appendOutput(rh, lh.operand);
    }
  } else if (lh.operator === 'NOT') {
    lh.operand = tryLookup(lh.operand);
    if (typeof lh.operand === 'number') {
      inputs[rh] = 65535 - lh.operand;
      notify = true;
    } else if (append) {
      appendOutput(rh, lh.operand);
    }
  } else if (lh.operator === 'LSHIFT') {
    lh.operand1 = tryLookup(lh.operand1);
    if (typeof lh.operand1 === 'number') {
      inputs[rh] = lh.operand1 << lh.operand2;
      notify = true;
    } else if (append) {
      appendOutput(rh, lh.operand1);
    }
  } else if (lh.operator === 'RSHIFT') {
    lh.operand1 = tryLookup(lh.operand1);
    if (typeof lh.operand1 === 'number') {
      inputs[rh] = lh.operand1 >>> lh.operand2;
      notify = true;
    } else if (append) {
      appendOutput(rh, lh.operand1);
    }
  } else if (lh.operator === 'AND') {
    lh.operand1 = tryLookup(lh.operand1);
    lh.operand2 = tryLookup(lh.operand2);
    if (typeof lh.operand1 === 'number' && typeof lh.operand2 === 'number') {
      inputs[rh] = lh.operand1 & lh.operand2;
      notify = true;
    } else {
      if (append && typeof lh.operand1 !== 'number') {
        appendOutput(rh, lh.operand1);
      }
      if (append && typeof lh.operand2 !== 'number') {
        appendOutput(rh, lh.operand2);
      }
    }
  } else if (lh.operator === 'OR') {
    lh.operand1 = tryLookup(lh.operand1);
    lh.operand2 = tryLookup(lh.operand2);
    if (typeof lh.operand1 === 'number' && typeof lh.operand2 === 'number') {
      inputs[rh] = lh.operand1 | lh.operand2;
      notify = true;
    } else {
      if (append && typeof lh.operand1 !== 'number') {
        appendOutput(rh, lh.operand1);
      }
      if (append && typeof lh.operand2 !== 'number') {
        appendOutput(rh, lh.operand2);
      }
    }
  }
  if (notify && outputs[rh]) {
    var k;
    for (k = outputs[rh].length; k-->0; ) {
      var listener = outputs[rh][k];
      if (evalInput(inputs[listener], listener, false)) {
        // listener EQ value and can stop listening
        if (k > 0) {
          outputs[rh].splice(k, 1);
        } else {
          delete outputs[rh];
        }
      }
    }
  }
  return notify;
}
function parseLine(s) {
  var h = s.split(' -> ');
  var lh = parseInput(h[0]);
  if (lh == null) {
    return;
  }
  var rh = h[1];
  inputs[rh] = lh;
  evalInput(lh, rh, true);
}
var i;
for (i = 0; i < input.length; i++) {
  parseLine(input[i]);
}
console.log(inputs.a);

// part b: substitute 956 -> b
inputs = {};
outputs = {};
for (i = 0; i < input.length; i++) {
  if (input[i] === '14146 -> b') {
    parseLine('956 -> b');
  } else {
    parseLine(input[i]);
  }
}
console.log(inputs.a);

