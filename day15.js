// problem: http://adventofcode.com/day/15
// input: http://adventofcode.com/day/15/input

function parseLine(s) {
  if (!s) { return null; }
  var ingredient = {};
  var nameTail = s.split(': ');
  ingredient.name = nameTail[0];
  var attrs = nameTail[1].split(', ');
  for (var j=0; j<attrs.length; j++) {
    var kv = attrs[j].split(' ');
    ingredient[kv[0]] = parseInt(kv[1]);
  }
  return ingredient;
}

var ingredients = {};
var inputs = document.body.innerText.split('\n');
for (var i = 0; i < inputs.length; i++) {
  var ingredient = parseLine(inputs[i]);
  if (ingredient) {
    ingredients[ingredient.name] = ingredient;
  }
}

var testIngredients = {
  Butterscotch: parseLine('Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8'),
  Cinnamon: parseLine('Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3')
};

function scoreRecipe(ingredientQuantities, ingredients) {
  var recipeScore = 1;
  var scoringAttrs = ['capacity', 'durability', 'flavor', 'texture'];
  var inKeys = Object.keys(ingredientQuantities);
  for (var p = 0; p<scoringAttrs.length; p++) {
    var attr = scoringAttrs[p];
    var attrScore = 0;
    for (var q = 0; q<inKeys.length; q++) {
      var ingredient = inKeys[q];
      attrScore += ingredientQuantities[ingredient] * ingredients[ingredient][attr];
    }
    if (attrScore <= 0) {
      return 0;
    }
    recipeScore *= attrScore;
  }
  return recipeScore;
}

function createRecipeBuilder(total, ingredients, calories) {
  var recipeBuilder = {
    total: total,
    ingredients: ingredients,
    ingredientList: Object.keys(ingredients),
    calories: calories,
    overflow: false,
    computeRemainder: function() {
      var remainder = this.total;
      for (var a=1; a<this.ingredientList.length; a++) {
        remainder -= this[this.ingredientList[a]];
      }
      this[this.ingredientList[0]] = remainder;
      return remainder;
    },
    build: function() {
      if (this.overflow) {
        return null;
      }
      var recipe = {};
      for (var i=0; i<this.ingredientList.length; i++) {
        var ingredient = this.ingredientList[i];
        recipe[ingredient] = this[ingredient];
      }
      return recipe;
    },
    next: function() {
      var carry = 1;
      while (carry < this.ingredientList.length) {
        var incIng = this.ingredientList[carry];
        this[incIng]++;
        if (this.computeRemainder() >= 0) {
          break;
        }
        for (var r=1; r<=carry; r++) {
          var resetIng = this.ingredientList[r];
          this[resetIng] = 0;
        }
        carry++;
      }
      if (carry >= this.ingredientList.length) {
        this.overflow = true;
      }
    },
    sumCalories: function() {
      if (this.overflow) {
        return this.calories;
      }
      var sum = 0;
      for (var a=0; a<this.ingredientList.length; a++) {
        var ingredient = this.ingredientList[a];
        sum += this[ingredient] * this.ingredients[ingredient].calories;
      }
      return sum;
    },
    nextCalories: function() {
      do {
        this.next();
      } while (this.sumCalories() != this.calories);
    },
    reset: function() {
      this.overflow = false;
      for (var a=1; a<this.ingredientList.length; a++) {
        var ingredient = this.ingredientList[a];
        this[ingredient] = 0;
      }
      this.computeRemainder();
      return this;
    }
  };
  return recipeBuilder.reset();
}

function findBestRecipe(total, ingredients) {
  var bestScore = 0;
  var rb = createRecipeBuilder(total, ingredients);
  var recipe;
  while (recipe = rb.build()) {
    bestScore = Math.max(bestScore, scoreRecipe(recipe, ingredients));
    rb.next();
  }
  return bestScore;
}

function findBestCalories(total, ingredients, calories) {
  var bestScore = 0;
  var rb = createRecipeBuilder(total, ingredients, calories);
  var recipe;
  rb.nextCalories();
  while (recipe = rb.build()) {
    bestScore = Math.max(bestScore, scoreRecipe(recipe, ingredients));
    rb.nextCalories();
  }
  return bestScore;
}
  
console.log(findBestRecipe(100, ingredients));
console.log(findBestCalories(100, ingredients, 500));
