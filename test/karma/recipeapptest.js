describe('RecipeApp Tests', function () {

	beforeEach(angular.mock.module('RecipeApp'));

	var $controller;

	beforeEach(angular.mock.inject(function(_$controller_){
	  $controller = _$controller_;
	}));

	describe('RecipeController', function () {
		it('model is correct', function () {
			var $scope = {};
      $scope.recipe = {};
      $scope.recipe.instructionType = "steps";
      $scope.recipe.instruction = "whatevah";
      $scope.recipe.type = "component";
			var controller = $controller('RecipeController', { $scope: $scope });
			expect(controller.instructionType).toBe("steps");
      expect(controller.instruction).toBe("whatevah");
      expect(controller.isComponent).toBe(true);
      expect(controller.isInstructionType("steps")).toBe(true);
      expect(controller.isInstructionType("basic")).toBe(false);
		});
	});

  describe('SearchController', function() {
    it('tests', function() {
      var $window = {};
      $window.location = {};
      $window.location.href = "";
      var controller = $controller('SearchController', { $window: $window });
      expect(controller.name).toBe("");
      expect(controller.isEmpty()).toBe(true);
      controller.name = "Tobias";
      expect(controller.name).toBe("Tobias");
      expect(controller.isEmpty()).toBe(false);
      controller.searchRecipes();
      expect($window.location.href).toBe("/recipes/Tobias");
    });

  });

  describe('RecipeListController', function() {
    it('tests', function() {
      var $window = {};
      $window.location = {};
      $window.location.href = "";
      var controller = $controller('RecipeListController', { $window: $window });

      controller.getRecipe("Spring Roll", "Tobias");
      expect($window.location.href).toBe("/recipe/Tobias/Spring Roll");

      expect(controller.recipesFound(null)).toBe(false);
      expect(controller.recipesFound([])).toBe(false);

      expect(controller.isTypeComponent("component")).toBe(true);
      expect(controller.isTypeComponent("uyay")).toBe(false);
    });

  });

  describe('EditRecipeController', function() {
    it('tests', function() {
      var $http = {};
      var $scope = {};
      var controller = $controller('EditRecipeController', { $http: $http, $scope: $scope });

      expect($scope.name).toBe("");
      expect($scope.type).toBe("meal");
      expect($scope.hours).toBe(0);
      expect($scope.minutes).toBe(5);
      expect($scope.description).toBe("");
      expect($scope.serving).toBe(1);
      expect($scope.totalAmount).toBe(1);
      expect($scope.totalUnit).toBe("g");
      expect($scope.isComponent()).toBe(false);
      expect($scope.instructionTab).toBe(1);

      $scope.type = "component";
      expect($scope.isComponent()).toBe(true);
      $scope.type = "meal"

      expect($scope.isValid()).toBe(false);

      $scope.name = "Tobias";
      $scope.description = "This is a testing recipe";
      $scope.basicInstruction = "bla bla bla bla bla bla";

      expect($scope.ingredientIsValid()).toBe(false);
      $scope.ingredient = "carrot";
      expect($scope.ingredientIsValid()).toBe(false);
      $scope.amount = 1;
      expect($scope.ingredientIsValid()).toBe(true);
      $scope.addIngredient();
      expect($scope.ingredientIsValid()).toBe(false);

      expect($scope.isValid()).toBe(true);

      $scope.removeIngredient(0);

      expect($scope.isValid()).toBe(false);

      $scope.ingredient = "carrot";
      $scope.amount = 1;
      $scope.addIngredient();
      expect($scope.isValid()).toBe(true);

    });

  });

});
