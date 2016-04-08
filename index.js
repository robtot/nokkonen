var express = require('express');
var mongo = require('mongodb');
var bodyparser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');
var app = express();
var configDB = require('./config/database.js');
var storage = require('./db/storage.js');
var validate = require('./validate.js');

mongoose.connect(configDB.url);

require('./config/passport.js')(passport)

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'templates'));

app.use(morgan('dev'));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/angular', express.static(path.join(__dirname, 'node_modules', 'angular')))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use(session({secret:'Kabo03xxxHALooo'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/login', function(req, res) {
  res.render('landing', { message: req.flash('loginMessage') });
});

app.get('/signup', function(req, res) {
  res.render('signup', { message: req.flash('signupMessage') });
});

app.get('/logout', isLoggedIn, function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

//display recipe
app.get('/recipe/:owner/:recipename', isLoggedIn, storage.getRecipe, function(req, res) {
  console.log(req.recipe);
  if (req.recipe == null) {
    res.send("no recipe matching username "+req.params.owner+" and recipe name "+req.params.recipename+" found.");
  }
  res.render('recipe', {recipe: JSON.stringify(req.recipe)});
});

//create new recipe from json in body of post request
app.post('/newrecipe', isLoggedIn, storage.addRecipe, function(req, res) {
  res.send("recipe added");
});

app.get('/', isLoggedIn, function(req, res) {
  res.render('index', { username: req.user.username });
});

//render form for submitting new recipe
app.get('/newrecipe', isLoggedIn, function(req, res) {
  res.render('newrecipeform');
});

//query for recipes based on atrributes entered in get url
app.get('/findrecipe', isLoggedIn, validate.recipeQuery, storage.searchRecipe, function(req, res) {
  res.json(req.documents);
});

app.get('/recipes/:name', isLoggedIn, storage.getRecipesByName, function(req, res) {
  
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

app.listen(3000);
