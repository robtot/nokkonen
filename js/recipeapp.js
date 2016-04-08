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
})();
