// problem: http://adventofcode.com/day/22
// input: http://adventofcode.com/day/22/input
var boss = {
  initialHp: 55,
  reset: function() {
    this.hp=this.initialHp;
    this.damage=8;
    this.poisonTimer=0;
    return this;
  },
  poisonEffect: function() {
    if (this.poisonTimer > 0) {
      this.hp -= 3;
      this.poisonTimer--;
    }
    return this.hp;
  }
};
var hero = {
  initialHp: 50,
  initialMana: 500,
  reset: function() {
    this.hp=this.initialHp;
    this.armor=0;
    this.mana=this.initialMana;
    this.rechargeTimer = 0;
    this.shieldTimer = 0;
    return this;
  },
  getHit: function(attacker) {
    this.hp -= Math.max(1, attacker.damage - this.armor);
    return this.hp;
  },
  shieldEffect: function() {
    if (this.shieldTimer === 1) {
      this.armor = 0;
    }
    if (this.shieldTimer > 0) {
      this.shieldTimer--;
    }
  },
  rechargeEffect: function() {
    if (this.rechargeTimer > 0) {
      this.mana += 101;
      this.rechargeTimer--;
    }
  }
};
function idle(hero, boss) {
  return 0;
}
function magicMissile(hero, boss) {
  if (hero.mana < 53) {
    return Infinity;
  }
  boss.hp -= 4;
  return 53;
}
function drain(hero, boss) {
  if (hero.mana < 73) {
    return Infinity;
  }
  hero.hp += 2;
  boss.hp -= 2;
  return 73;
}
function shield(hero, boss) {
  if (hero.mana < 113 || hero.shieldTimer > 0) {
    return Infinity;
  }
  hero.shieldTimer = 6;
  hero.armor = 7;
  return 113;
}
function poison(hero, boss) {
  if (hero.mana < 173 || boss.poisonTimer > 0) {
    return Infinity;
  }
  boss.poisonTimer = 6;
  return 173;
}
function recharge(hero, boss) {
  if (hero.mana < 229 || hero.rechargeTimer > 0) {
    return Infinity;
  }
  hero.rechargeTimer = 5;
  return 229;
}

var actions = [ idle, magicMissile, drain, shield, poison, recharge ];

// return mana spent if a winner (under limit), otherwise Infinity
function heroSpentMana(hero, boss, actionPlan, limit) {
  if (limit === undefined) {
    limit = Infinity;
  }
  var manaSpent = 0;
  hero.reset();
  boss.reset();
  while (true) {
    // player turn
    if (boss.poisonEffect() <= 0) {
      return manaSpent;
    }
    hero.rechargeEffect();
    hero.shieldEffect();
    var a = actionPlan % actions.length;
    // console.log(['idle','magicMissile','drain','shield','poison','recharge'][a]);
    actionPlan = Math.floor(actionPlan/actions.length);
    var spent = actions[a](hero, boss); // Infinity when impossible (no mana or effect already active)
    if (manaSpent >= limit) {
      return Infinity;
    }
    manaSpent += spent;
    hero.mana -= spent;

    // boss turn
    if (boss.poisonEffect() <= 0) {
      return manaSpent;
    }
    hero.rechargeEffect();
    hero.shieldEffect();
    if (hero.getHit(boss) <= 0) {
      return Infinity;
    }
  }
}
// this action plan costs 1066: parseInt(1111431543, 6)
function findMinManaSpent() {
  var minManaSpent = 1067;
  var bestPlan = Infinity;
  for (var p = 1; p <= parseInt(1111431543, 6); p++) {
    var spent = heroSpentMana(hero, boss, p, minManaSpent);
    if (spent < minManaSpent) {
      minManaSpent = spent;
      bestPlan = p;
      var planSteps = bestPlan.toString(6).split("").reverse().join("");
      console.log('Action plan ' + bestPlan + ' (' + planSteps + ') succeeded and cost ' + minManaSpent);
    }
  }
  return minManaSpent;
}
