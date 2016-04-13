var test = require('unit.js');
var httpMocks = require('node-mocks-http');
var storage = test.promisifyAll(require('../db/storage.js'));

var testRecipe = {
  name: "TestRecipe",
  owner: "TestOwner",
  type: "meal",
  hours: 1,
  minutes: 1,
  description: "Description for Test Recipe.",
  instructionType: "basic",
  instruction: "Instructions for Test Recipe.",
  serving: 1,
  ingredients: [
    {
      name: "carrot",
      amount: 10,
      unit: "g"
    }
  ],
};

describe('Testing Storage Methods', function() {
  it('add, attempt readd, get and remove recipe', function(done) {
    var req = httpMocks.createRequest(),
      res = httpMocks.createResponse();

    req.body = testRecipe;

    test
      .object(req.body)
        .hasProperty('name')
        .hasProperty('owner');

    storage.addRecipe(req, res, function() {
      test
        .string(req.result)
          .is("added");

      //attempt readd
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();

      req.body = testRecipe;

      test
        .object(req.body)
          .hasProperty('name')
          .hasProperty('owner');

      storage.addRecipe(req, res, function() {
        test
          .string(req.result)
            .is("exists");

        //get recipe
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();

        req.params = {owner: "TestOwner", recipename: "TestRecipe"};

        test
          .object(req)
            .hasNotProperty("recipe");

        storage.getRecipe(req, res, function() {
          test
            .object(req.recipe)
              .isNotEqualTo(null)
              .hasProperty('name');

          //remove recipe
          req = httpMocks.createRequest();
          res = httpMocks.createResponse();

          req.params = {};
          req.params.owner = "TestOwner";
          req.params.recipename = "TestRecipe";

          storage.removeRecipe(req, res, function() {
            test
              .bool(req.result)
                .isTrue();

            done();
          });

        });

      });

    });

  });

  it('removeRecipe Test Unexistent', function(done) {
    var req = httpMocks.createRequest(),
      res = httpMocks.createResponse();

    req.params = {};
    req.params.owner = "TestOwner";
    req.params.recipename = "TestRecipeDoesNotExist";

    storage.removeRecipe(req, res, function() {
      test
        .bool(req.result)
          .isFalse();

      done();
    });

  });

});
