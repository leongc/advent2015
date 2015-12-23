// problem: http://adventofcode.com/day/23
// input: http://adventofcode.com/day/23/input

function parseLine(s) {
  if (!s) { return null; }
  var opregOffset = s.split(',');
  var offset = opregOffset.length > 1 ? parseInt(opregOffset[1]) : null;
  var opreg = opregOffset[0].split(' ');
  var op = opreg[0];
  var reg = null;
  if (op === 'jmp') {
    offset = parseInt(opreg[1]);
  } else {
    reg = opreg[1];
  }
  return { op: op, reg: reg, offset: offset };
}
function getInputs(lines) {
  var inputs = [];
  if (lines === undefined) {
    lines = document.body.innerText.split('\n');
  }
  for (var i = 0; i < lines.length; i++) {
    var line = parseLine(lines[i]);
    if (line) {
      inputs.push(line);
    }
  }
  return inputs;
}
function step(instruction, state) {
  if (instruction.op === 'hlf') {
    state[instruction.reg] = Math.round(state[instruction.reg]/2);
    state.pc++;
  } else if (instruction.op === 'tpl') {
    state[instruction.reg] *= 3;
    state.pc++;
  } else if (instruction.op === 'inc') {
    state[instruction.reg]++;
    state.pc++;
  } else if (instruction.op === 'jmp') {
    state.pc += instruction.offset;
  } else if (instruction.op === 'jie') {
    state.pc += (state[instruction.reg] % 2 == 0) ? instruction.offset : 1;
  } else if (instruction.op === 'jio') {
    state.pc += (state[instruction.reg] === 1) ? instruction.offset : 1;
  } else {
    console.log('Error, unknown op: ' + instruction.op + ' at line ' + state.pc);
    state.pc = -1;
  }
  return state;
}
function run(instructions, state) {
  if (state === undefined) {
    state = { a:0, b:0, pc:0 };
  }
  while (0 <= state.pc && state.pc < instructions.length) {
    state = step(instructions[state.pc], state);
  }
  return state;
}
console.log(run(getInputs()).b);
console.log(run(getInputs(), {a:1, b:0, pc:0}).b);
