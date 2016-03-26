//client input validation scripts
module.exports = {
  recipeQuery:
    function (req, res, next) {
      req.jsonquery = {};
      var empty = 1;
      if (req.query.recipename) {
        req.jsonquery.recipename = req.query.recipename;
        empty = 0;
      }

      if (req.query.description) {
        req.jsonquery.description = req.query.description;
        empty = 0;
      }

      var ingredients = req.query.ingredient;
      var instructions = req.query.instruction;
      if (typeof ingredients !== 'undefined' && ingredients.length > 0) {
        req.jsonquery.ingredient = { $all: ingredients };
        empty = 0;
      }

      if (typeof instructions !== 'undefined' && instructions.length > 0) {
        req.jsonquery.instruction = { $all: instructions };
        empty = 0;
      }

      if (empty) {
        res.send("Query parameters are not valid!");
      } else {
        next();
      }

    }

}
