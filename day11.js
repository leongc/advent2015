// problem: http://adventofcode.com/day/11
// input: vzbxkghb

function nextLetter(c) {
  if (c === 'z') {
    return 'a';
  }
  var d = c.charCodeAt(0) + 1;
  // skip i,l,o
  if (d == 105 || d == 108 || d == 111) {
    d++;
  }
  return String.fromCharCode(d);
}
function nextString(s) {
  var result = '';
  var carry = true;
  var c = 'a';
  for (var i = s.length; i--> 0; ) {
    if (carry && c === 'a') {
      c = nextLetter(s[i]);
      result = c + result;
    } else {
      carry = false;
      c = '';
      result = s.slice(0, i+1) + result;
      break;
    }
  }
  if (carry && c === 'a') {
    result = 'a' + result;
  }
  return result;
}
function hasStraight(s) {
  for (var i = 0; i < s.length - 2; i++) {
    var c = s.charCodeAt(i);
    if (s.charCodeAt(i+1) === c+1 && s.charCodeAt(i+2) === c+2) {
      return true;
    }
  }
  return false;
}
function hasTwoPairs(s) {
  var c1 = '';
  var firstPair = false;
  var c2 = '';
  for (var i = 0; i < s.length; i++) {
    if (firstPair) {
      if (s[i] === c2) {
        return true;
      }
      if (s[i] === c1) {
        c2 = '';
      } else {
        c2 = s[i];
      }
    } else if (s[i] === c1) {
      firstPair = true;
    } else {
      c1 = s[i];
    }
  }
  return false;
}
function nextPassword(s) {
  var candidate = nextString(s);
  while (!(hasTwoPairs(candidate) && hasStraight(candidate))) {
    candidate = nextString(candidate);
  }
  return candidate;
}
var next = nextPassword('vzbxkghb');
console.log(next);
next = nextPassword(next);
console.log(next);
