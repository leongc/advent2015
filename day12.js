// problem: http://adventofcode.com/day/12
// input: http://adventofcode.com/day/12/input

function sum(o) {
  if (typeof o === "number") {
    return o;
  }
  var m = 0;
  if (typeof o === "object") {
    var k = Object.keys(o);
    for (var j = 0; j < k.length; j++) {
      m += sum(o[k[j]]);
    }
  }
  return m;
}

// part b
function sumb(o) {
  if (typeof o === "number") {
    return o;
  }
  var m = 0;
  if (Array.isArray(o)) {
    for (var i = 0; i < o.length; i++) {
      m += sumb(o[i]);
    }
  } else if (typeof o === "object") {
    var k = Object.keys(o);
    for (var j = 0; j < k.length; j++) {
      if (o[k[j]] === 'red') {
        return 0;
      }
      m += sumb(o[k[j]]);
    }
  }
  return m;
}


  
