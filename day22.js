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
  },
  toString: function() {
    return 'hp:'+this.hp+' pt:'+this.poisonTimer;
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
  toString: function() {
    return 'hp:'+this.hp+' ar:'+this.armor+' m:'+this.mana+' rt:'+this.rechargeTimer+' st:'+this.shieldTimer;
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

var actions = [ magicMissile, drain, shield, poison, recharge ];

// return mana spent if a winner (under limit), otherwise Infinity
function heroSpentMana(hero, boss, actionPlan, limit, hard) {
  if (limit === undefined) {
    limit = Infinity;
  }
  var manaSpent = 0;
  hero.reset();
  boss.reset();
  while (true) {
    // player turn
    if (hard && --hero.hp <= 0) {
      return Infinity;
    }
    if (boss.poisonEffect() <= 0) {
      return manaSpent;
    }
    hero.rechargeEffect();
    hero.shieldEffect();
    var a = actionPlan % actions.length;
    // console.log(['magicMissile','drain','shield','poison','recharge'][a]);
    actionPlan = Math.floor(actionPlan/actions.length);
    var spent = actions[a](hero, boss); // Infinity when impossible (no mana or effect already active)
    manaSpent += spent;
    if (manaSpent >= limit) {
      // console.log(hero);
      return Infinity;
    }
    hero.mana -= spent;
    // console.log('Hero:'+hero.toString()+'\t\tBoss:'+boss.toString());

    // boss turn
    if (boss.poisonEffect() <= 0) {
      return manaSpent;
    }
    hero.rechargeEffect();
    hero.shieldEffect();
    if (hero.getHit(boss) <= 0) {
      //console.log(hero);
      return Infinity;
    }
    // console.log('Hero:'+hero.toString()+'\t\tBoss:'+boss.toString());
  }
}
//Action plan 448 (3423) succeeded and cost 953
function findMinManaSpent(hard) {
  var minManaSpent = Infinity;
  var bestPlan = Infinity;
  for (var p = 1; p <= 188926; p++) {
    var spent = heroSpentMana(hero, boss, p, minManaSpent, hard);
    if (spent < minManaSpent) {
      minManaSpent = spent;
      bestPlan = p;
      var planSteps = bestPlan.toString(5).split("").reverse().join("");
      console.log('Action plan ' + bestPlan + ' (' + planSteps + ') succeeded and cost ' + minManaSpent);
    }
  }
  return minManaSpent;
}
