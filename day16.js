// problem: http://adventofcode.com/day/16
// input: http://adventofcode.com/day/16/input

var target = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
  matches: function(sue) {
    if (!sue) { return false; }
    var attrs = Object.keys(sue);
    for (var j = 0; j < attrs.length; j++) {
      var attr = attrs[j];
      if (attr === "name") {
        continue;
      }
      if (sue[attr] !== this[attr]) {
        return false;
      }
    }
    return true;
  }
};

function parseLine(s) {
  if (!s) { return null; }
  var name = s.split(':', 1)[0];
  var attrvals = s.substr(name.length+2).split(', ');
  var sue = { name: name };
  for (var m = 0; m < attrvals.length; m++) {
    var kv = attrvals[m].split(': ');
    sue[kv[0]] = parseInt(kv[1]);
  }
  return sue;
}

var candidate;
var inputs = document.body.innerText.split('\n');
for (var i = 0; i < inputs.length; i++) {
  candidate = parseLine(inputs[i]);
  if (target.matches(candidate)) {
    console.log(candidate);
    break;
  }
}
