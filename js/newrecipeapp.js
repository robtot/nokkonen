(function() {
  var app = angular.module('NewRecipeApp', []);
  app.controller('RecipeController', function() {
    this.recipe = {};
    this.logRecipe = function() {
      console.log(this.recipe);
    };
  });

  app.controller('InstructionController', function() {
    this.tab = 1;
    this.setTab = function(newTab) {
      this.tab = newTab;
    };

    this.isSet = function(testTab) {
      return this.tab === testTab;
    };

  });

})();
