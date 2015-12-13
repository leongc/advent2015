// problem: http://adventofcode.com/day/10
// https://en.wikipedia.org/wiki/Look-and-say_sequence
// input: 1113122113 iterate forty times

function lookAndSay(s) {
  var result = "";
  var curChar = s[0];
  var curCount = 0;
  for (var i=0; i<s.length; i++) {
    if (curChar === s[i]) {
      curCount++;
    } else {
      result += curCount;
      result += curChar;
      curChar = s[i];
      curCount = 1;
    }
  }
  result += curCount;
  result += curChar;
  return result;
}
var a = "1113122113";
for (var j=0; j<40; j++) {
  a = lookAndSay(a);
}
console.log(a.length);
var b = a;
for (var j=0; j<10; j++) {
  b = lookAndSay(b);
}
console.log(b.length);
