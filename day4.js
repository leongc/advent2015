// http://adventofcode.com/day/4
// lowest number prefixed by 'yzbqklnj' whose md5 hash begins with 00000
// use md5 implementation at https://gist.github.com/MichaelPote/3f0cefaaa9578d7e30be
var i = 0;
var lead;
do {
  var candidate = 'yzbqklnj' + (++i);
  var hash = md5(candidate);
  var lead = hash.substr(0,5);
} while (lead != '00000');
console.log(i);

// part 2, six zeroes 000000
do {
  var candidate = 'yzbqklnj' + (++i);
  var hash = md5(candidate);
  var lead = hash.substr(0,6);
} while (lead != '000000');
console.log(i);
