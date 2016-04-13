var mongo = require('mongodb');
var recipesCollection = 'recipes';
var url = 'mongodb://localhost:27017/nokkonen';

module.exports = {
  addRecipe:
    function(req, res, next) {
      var recipe = req.body;
      //check if recipe is valid
      if (recipe == null || !recipe.hasOwnProperty('owner') || !recipe.hasOwnProperty('name') || !recipe.hasOwnProperty('type') || !recipe.hasOwnProperty('hours') || !recipe.hasOwnProperty('minutes') || !recipe.hasOwnProperty('description') || !recipe.hasOwnProperty('instruction') || !recipe.hasOwnProperty('instructionType') || !recipe.hasOwnProperty('ingredients')) {
        req.result = "invalid";
        next();
      }

      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipesCollection);

        //check if recipe exists
        var owner = new RegExp("^"+recipe.owner+"$", 'i');
        var name = new RegExp("^"+recipe.name+"$", 'i');
        collection.findOne(
          { $and: [
            { owner: { $regex: owner } },
            { name: { $regex: name } }
          ]},
          { _id: 1 },
          function(err, document) {
            if (err) throw err;
            if (document != null) {
              req.result = "exists";
              db.close();
              next();
            } else {
              //add recipe
              collection.insert(recipe, function(err, data) {
                if (err) throw err;
                db.close();
                req.result = "added";
                next();
              });

            }

        });

      });

    },

  findRecipesByName:
    function(req, res, next) {
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipesCollection);
        var name = new RegExp("("+req.params.name+")", 'i');
        collection.find({name: { $regex: name } }, { name: 1, owner: 1, type:1, hours: 1, minutes: 1, serving: 1, amount: 1, unit: 1 }).limit(20).toArray(function(err, documents) {
          if (err) throw err;
          req.result = documents;
          db.close();
          next();
        });

      });

    },

  getYourRecipes:
  function(req, res, next) {
    mongo.connect(url, function(err, db) {
      if (err) throw err;
      var collection = db.collection(recipesCollection);
      var owner = new RegExp("^"+req.user.username+"$", 'i');
      req.recipe = collection.find({ owner: { $regex: owner } }, { name: 1, owner: 1, type:1, hours: 1, minutes: 1, serving: 1, amount: 1, unit: 1 }).toArray(function(err, documents) {
        if (err) throw err;
        req.result = documents;
        db.close();
        next();
      });

    });

  },

  getRecipe:
    function(req, res, next) {
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipesCollection);
        var owner = new RegExp("^"+req.params.owner+"$", 'i');
        var name = new RegExp("^"+req.params.recipename+"$", 'i');
        req.recipe = collection.findOne({ $and: [
          { owner: { $regex: owner } },
          { name: { $regex: name } }
        ]}, function(err, result) {
          if (err) throw err;
          req.recipe = result;
          db.close();
          next();
        });

      });

    },

  removeRecipe:
    function(req, res, next) {
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipesCollection);
        var owner = req.params.owner;
        var name = req.params.recipename;
        collection.remove(
          { $and: [
            { owner: { $eq: owner } },
            { name: { $eq: name } }
          ]},
          { justOne: true },
          function (err, result) {
            if (err) throw err;
            if (result.result.n == 1) {
              req.result = true;
            } else {
              req.result = false;
            }

            db.close();
            next();
          }

        );

      });

    },

}
