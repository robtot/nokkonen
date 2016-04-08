(function() {
  var app = angular.module('SearchApp', []);
  app.controller('SearchController', ['$window', function($window) {
    this.name = "";
    this.searchRecipes = function() {
      $window.location.href = '/recipes/'+this.name;
    };

  }]);

})();
