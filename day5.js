// problem: http://adventofcode.com/day/5
// input: http://adventofcode.com/day/5/input

function isNice(s) {
  var prevLetter = '';
  var vowels = 0;
  var doubleLetter = false;
  for (j = 0; j < s.length; j++) {
    if ((prevLetter == 'a' && s[j] == 'b')
      ||(prevLetter == 'c' && s[j] == 'd')
      ||(prevLetter == 'p' && s[j] == 'q')
      ||(prevLetter == 'x' && s[j] == 'y')) {
      return false;
    }
    if (!doubleLetter && prevLetter == s[j]) {
      doubleLetter = true;
    }
    if (s[j] == 'a' || s[j] == 'e' || s[j] == 'i' || s[j] == 'o' || s[j] == 'u') {
      vowels++;
    }
    prevLetter = s[j];
  }
  return doubleLetter && vowels >= 3;
}

function isNice2(s) {
  if (s.length < 3) { return false; }
  var prevLetter;
  var curLetter;
  var nextLetter;
  var seenPairs = {};
  var hasSplitSingle = false;
  var hasDuplicatePair = false;
  for (k = 2; k < s.length; k++) {
    prevLetter = s[k-2];
    curLetter = s[k-1];
    nextLetter = s[k];
    if (!hasSplitSingle && prevLetter == nextLetter) {
      hasSplitSingle = true;
    }
    if (!hasDuplicatePair) {
      if (seenPairs[curLetter + nextLetter] === undefined) {
        // insert trailing pair to prevent overlapped pair detection
        seenPairs[prevLetter + curLetter] = 1;
      } else {
        hasDuplicatePair = true;
        seenPairs = null;
      }
    }
    if (hasSplitSingle && hasDuplicatePair) {
      return true;
    }
  }
  return false;
}

var input = document.body.innerText.split('\n');
var niceCount = 0;
var nice2Count = 0;
for (i = 0; i < 100; i++) {
  if (isNice(input[i])) {
    niceCount++;
  }
  if (isNice2(input[i])) {
    nice2Count++;
  }
}
console.log(niceCount);
console.log(nice2Count);
