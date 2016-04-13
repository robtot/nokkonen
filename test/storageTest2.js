var test = require('unit.js');
var httpMocks = require('node-mocks-http');
var storage = test.promisifyAll(require('../db/storage.js'));

var testRecipeInvalid = {
  name: "TestRecipe2",
  owner: "TestOwner",
  hours: 1,
  minutes: 1,
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

describe('Testing Storage Methods 2', function() {

  it('addRecipe Invalid Recipe Test', function(done) {
    var req = httpMocks.createRequest(),
      res = httpMocks.createResponse();

    req.body = testRecipeInvalid;

    test
      .object(req.body)
        .hasProperty('name')
        .hasProperty('owner');

    storage.addRecipe(req, res, function() {
      test
        .string(req.result)
          .is("invalid");

      done();
    });

  });

});
