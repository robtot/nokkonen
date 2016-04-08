(function() {
  var app = angular.module('RecipeListApp', []);
  app.controller('RecipeListController', ['$window', function($window) {
    this.getRecipe = function(recipename, recipeowner) {
      $window.location.href = '/recipe/'+recipeowner+'/'+recipename;
    };

  }]);

})();
