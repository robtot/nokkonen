var mongo = require('mongodb');
var recipesCollection = 'recipes';
var url = 'mongodb://localhost:27017/nokkonen';

module.exports = {
  addRecipe:
    function(req, res, next) {
      req.body.owner = req.user.username;
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipesCollection);
        collection.insert(req.body, function(err, data) {
          if (err) throw err;
          db.close();
          next();
        });

      });

    },

  searchRecipe:
    function(req, res, next) {
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipesCollection);
        collection.find(req.jsonquery).toArray(function(err, documents) {
          if (err) throw err;
          db.close();
          req.result = documents;
          next();
        });

      });

    },

  getRecipesByName:
    function(req, res, next) {
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipeCollection);
        var name = new RegExp(req.params.recipename, 'i');
        collection.find({name: { $regex: name } }, { name: 1, owner: 1, hours: 1, minutes: 1, serving: 1, amount: 1, unit: 1 }).toArray(function(err, documents) {
          if (err) throw err;
          db.close();
          req.result = documents;
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

    }

}
