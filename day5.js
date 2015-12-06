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

var input = document.body.innerText.split('\n');
var niceCount = 0;
for (i = 0; i < input.length; i++) {
  if (isNice(input[i])) {
    niceCount++;
  }
}
console.log(niceCount);
