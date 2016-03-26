var mongo = require('mongodb');
var recipesCollection = 'recipes';
var url = 'mongodb://localhost:27017/recipeapi';

module.exports = {
  addRecipe:
    function(req, res, next) {
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection(recipesCollection);
        collection.insert(req.body, function(err, data) {
          if (err) throw err;
          db.close();
        });

      });

      next();
    },

  searchRecipe:
    function(req, res, next) {
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection('recipes');
        var result = collection.find(req.jsonquery).toArray(function(err, documents) {
          if (err) throw err;
          db.close();
          req.result = documents;
        });

        next();
      });

    }

}
