(function() {
  var app = angular.module('RecipeApp', []);
  app.controller('RecipeController', ['$scope', function($scope) {
    console.log($scope.recipe);
    this.instructionType = $scope.recipe.instructionType;
    this.instruction = $scope.recipe.instruction;
    if ($scope.recipe.type == "component") {
      this.isComponent = true;
    } else {
      this.isComponent = false;
    }

    this.isInstructionType = function(type) {
      if (this.instructionType == type) {
        return true;
      } else {
        return false;
      }

    };

  }]);

  app.controller('SearchController', ['$window', function($window) {
    this.name = "";
    this.searchRecipes = function() {
      $window.location.href = '/recipes/'+this.name;
    };

  }]);

  app.controller('RecipeListController', ['$window', function($window) {
    this.getRecipe = function(recipename, recipeowner) {
      $window.location.href = '/recipe/'+recipeowner+'/'+recipename;
    };

  }]);

  app.controller('EditRecipeController', ['$http', '$scope', function($http, $scope) {
    $scope.name = "";
    $scope.type = "meal";
    $scope.hours = 0;
    $scope.minutes = 5;
    $scope.description = "";
    $scope.serving=1;
    $scope.totalAmount=1;
    $scope.totalUnit="g";

    //serving or amount
    $scope.isComponent = function() {
      if ($scope.type === "component") {
        return true;
      } else {
        return false;
      }

    };

    //instruction functionality
    $scope.instructionTab = 1;
    $scope.stepInstructions = [""];
    $scope.basicInstruction = "";
    $scope.setTab = function(newTab) {
      $scope.instructionTab = newTab;
    };

    $scope.isSet = function(testTab) {
      return $scope.instructionTab === testTab;
    };

    $scope.addStep = function() {
      $scope.stepInstructions.push("");
    };

    $scope.removeLastStep = function() {
      $scope.stepInstructions.pop();
    };

    $scope.stepsEmpty = function() {
      if ($scope.stepInstructions.length === 0) {
        return true;
      } else {
        return false;
      }

    };

    //ingredient functionality
    $scope.ingredients = [];
    $scope.ingredient = "";
    $scope.amount = 0;
    $scope.unit = "g";
    $scope.addIngredient = function() {
      if ($scope.ingredientIsValid()) {
        $scope.ingredients.push({name: $scope.ingredient, amount: $scope.amount, unit: $scope.unit});
        $scope.amount = 0;
        $scope.unit = "g";
        $scope.ingredient = "";
      }

    };

    $scope.removeIngredient = function(index) {
      $scope.ingredients.splice(index, 1);
    };

    $scope.ingredientIsValid = function() {
      if ($scope.ingredient.length === 0 || $scope.amount === 0 || $scope.unit.length === 0) {
        return false;
      } else {
        return true;
      }

    };

    //validation
    $scope.isValid = function() {
      if ($scope.ingredients.length === 0 || $scope.name.length === 0 || $scope.type.length === 0 || $scope.description.length < 10) return false;
      if ($scope.hours === 0 && $scope.minutes === 0) return false;
      if ($scope.ingredients.length === 0) return false;
      switch($scope.instructionTab) {
        case 1:
          if ($scope.basicInstruction.length > 10) {
            return true;
          } else {
            return false;
          }

        case 2:
          if($scope.stepInstructions.length != 0) {
            return true;
          } else {
            return false;
          }

      }

    };


    //submitting
    $scope.submitRecipe = function() {
      finalRecipe = $scope.getFinalRecipe();
      $http({
        method: 'POST',
        url: '/newrecipe',
        data: finalRecipe,
        headers: {'Content-Type': 'application/json'}
      }).success(function(data) {
        if (data.errors) {
          console.log("POST ERROR: "+data.errors);
        } else {
          window.location = '/';
        }

      });

    };

    //debugging
    $scope.log = function(x) {
      console.log(x);
    };

    $scope.getFinalRecipe = function() {
      finalRecipe = {name: $scope.name, type: $scope.type, hours: $scope.hours, minutes: $scope.minutes, description: $scope.description};
      if ($scope.isSet(1)) {
        finalRecipe.instruction = $scope.basicInstruction;
        finalRecipe.instructionType = "basic";
      } else if ($scope.isSet(2)) {
        finalRecipe.instruction = $scope.stepInstructions;
        finalRecipe.instructionType = "steps";
      }

      if ($scope.isComponent()) {
        finalRecipe.amount = $scope.totalAmount;
        finalRecipe.unit = $scope.totalUnit;
      } else {
        finalRecipe.serving = $scope.serving;
      }

      finalRecipe.ingredients = $scope.ingredients;

      return JSON.stringify(finalRecipe);
    };

  }]);
  
})();
