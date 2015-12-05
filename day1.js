// problem: http://adventofcode.com/day/1
// input: http://adventofcode.com/day/1/input
var input = document.body.innerText;
var result = 0; 
var base = 0;
for (i=0; i<input.length; i++) { 
  if (input[i] == "(") { 
    result++; 
  } else { 
    result--; 
    if (base <= 1 && result == -1) {
      base=i+1;
    }
  }
}
console.log(result);
console.log(base);
