var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
  name: String,
  type: String,
  owner: String,
  description: String,
  serving: Number,
  time: String,
  instructionBasic: String,
  ingredients: [{
    name: String,
    amount: Number,
    unit: String
  }],
  includeRecipe: [{
    name: String,
    owner: name
  }]
});

module.exports = mongoose.model('Recipe', recipeSchema);
