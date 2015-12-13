// problem: http://adventofcode.com/day/8
// input: http://adventofcode.com/day/8/input

function parseLine(s) {
  if (!s) { 
    return 0; 
  }
  var skipped = 2; // assume quotes
  var i = 1; 
  while (i < s.length-2) {
    if (s[i] === '\\') {
      if (s[i+1] === '\"' || s[i+1] === '\\') {
        skipped++;
        i += 2;
      } else if (s[i+1] === 'x') {
        // assume two hex chars follow
        skipped += 3;
        i += 4;
      }
    } else {
      i++;
    }
  }
  return skipped;
}
var sum = 0;
var input = document.body.innerText.split('\n');
for (var j = 0; j < input.length; j++) { 
  sum += parseLine(input[j]); 
}
console.log(sum);

function embiggenLine(s) {
  if (!s) {
    return 0;
  }
  var added = 2; // surround line in double-quotes
  for (var k = 0; k < s.length; k++) {
    if (s[k] === '\\' || s[k] === '\"') {
      added++;
    }
  }
  return added;
}
var sum2 = 0;
for (var j = 0; j < input.length; j++) { 
  sum2 += embiggenLine(input[j]); 
}
console.log(sum2);
