// problem: http://adventofcode.com/day/21
// input: Hit Points: 109, Damage: 8, Armor: 2
// You have 100 hit points.
// Here is what the item shop is selling:
var weapons = [ // choose one
{name:'Dagger',cost:8,damage:4,armor:0},
{name:'Shortsword',cost:10,damage:5,armor:0},
{name:'Warhammer',cost:25,damage:6,armor:0},
{name:'Longsword',cost:40,damage:7,armor:0},
{name:'Greataxe',cost:74,damage:8,armor:0}];

var armors = [ // choose one
{name:'Emperor\'s new clothes',cost:0,damage:0,armor:0},
{name:'Leather',cost:13,damage:0,armor:1},
{name:'Chainmail',cost:31,damage:0,armor:2},
{name:'Splintmail',cost:53,damage:0,armor:3},
{name:'Bandedmail',cost:75,damage:0,armor:4},
{name:'Platemail',cost:102,damage:0,armor:5}];

var rings = [ // choose zero, one, or two
{name:'Damage +1',cost:25,damage:1,armor:0},
{name:'Damage +2',cost:50,damage:2,armor:0},
{name:'Damage +3',cost:100,damage:3,armor:0},
{name:'Defense +1',cost:20,damage:0,armor:1},
{name:'Defense +2',cost:40,damage:0,armor:2},
{name:'Defense +3',cost:80,damage:0,armor:3}];

function getHit(attacker) {
  this.hp -= Math.max(1, attacker.damage - this.armor);
  return this.hp;
}
var testBoss = { 
  reset: function() { 
    this.hp=12; 
    this.damage=7; 
    this.armor=2; 
  }, 
  getHit: getHit 
};
var boss = {
  reset: function() {
    this.hp=109;
    this.damage=8;
    this.armor=2;
  },
  getHit: getHit
};
var hero = {
  equip: function(e) {
    this.cost += e.cost;
    this.damage += e.damage;
    this.armor += e.armor;
  },
  equipAll: function(es) {
    this.hp=100;
    this.damage=0;
    this.armor=0;
    this.cost=0;
    for (var e = 0; e < es.length; e++) {
      this.equip(es[e]);
    }
    return this;
  },
  getHit: getHit
};
function heroWins(hero, boss) {
  boss.reset();
  while (true) {
    if (boss.getHit(hero) <= 0) {
      return true;
    }
    if (hero.getHit(boss) <= 0) {
      return false;
    }
  }
}
function findCheapHero() {
  var minCost = Infinity;
  for (var w = 0; w < weapons.length; w++) {
    var weapon = weapons[w];
    for (var a = 0; a < armors.length; a++) {
      var armor = armors[a];
      // try no rings
      hero.equipAll([weapon, armor]);
      if (hero.cost >= minCost) {
        continue;
      }
      if (heroWins(hero, boss)) {
        minCost = hero.cost;
        // console.log(weapon.name + ' ' + armor.name + ' ' + hero.cost);
      }
      for (r1 = 0; r1 < rings.length; r1++) {
        var ring1 = rings[r1];
        // try one ring
        hero.equipAll([weapon, armor, ring1]);
        if (hero.cost >= minCost) {
          continue;
        }
        if (heroWins(hero, boss)) {
          minCost = hero.cost;
          // console.log(weapon.name + ' ' + armor.name + ' ' + ring1.name + ' ' + hero.cost);
        }
        for (r2 = r1+1; r2 < rings.length; r2++) {
          var ring2 = rings[r2];
          // try two rings
          hero.equipAll([weapon, armor, ring1, ring2]);
          if (hero.cost >= minCost) {
            continue;
          }
          if (heroWins(hero, boss)) {
            minCost = hero.cost;
            // console.log(weapon.name + ' ' + armor.name + ' ' + ring1.name + ' ' + ring2.name + ' ' + hero.cost);
          }
        } // r2
      } // r1
    } // a
  } // w
  return minCost;
}
console.log(findCheapHero());

function findRichLoser() {
  var maxCost = -Infinity;
  for (var w = 0; w < weapons.length; w++) {
    var weapon = weapons[w];
    for (var a = 0; a < armors.length; a++) {
      var armor = armors[a];
      // try no rings
      hero.equipAll([weapon, armor]);
      if (hero.cost > maxCost && !heroWins(hero, boss)) {
        maxCost = hero.cost;
        console.log(weapon.name + ' ' + armor.name + ' ' + hero.cost);
      }
      for (r1 = 0; r1 < rings.length; r1++) {
        var ring1 = rings[r1];
        // try one ring
        hero.equipAll([weapon, armor, ring1]);
        if (hero.cost > maxCost && !heroWins(hero, boss)) {
          maxCost = hero.cost;
          console.log(weapon.name + ' ' + armor.name + ' ' + ring1.name + ' ' + hero.cost);
        }
        for (r2 = r1+1; r2 < rings.length; r2++) {
          var ring2 = rings[r2];
          // try two rings
          hero.equipAll([weapon, armor, ring1, ring2]);
          if (hero.cost > maxCost && !heroWins(hero, boss)) {
            maxCost = hero.cost;
            console.log(weapon.name + ' ' + armor.name + ' ' + ring1.name + ' ' + ring2.name + ' ' + hero.cost);
          }
        } // r2
      } // r1
    } // a
  } // w
  return maxCost;
}
console.log(findRichLoser());
