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

app.get('/login', isNotLoggedIn, function(req, res) {
  res.render('landing', { message: req.flash('loginMessage') });
});

app.get('/signup', isNotLoggedIn, function(req, res) {
  res.render('signup', { message: req.flash('signupMessage') });
});

app.get('/logout', isLoggedIn, function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post('/signup', isNotLoggedIn, passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

app.post('/login', isNotLoggedIn, passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

//display recipe
app.get('/recipe/:owner/:recipename', isLoggedIn, storage.getRecipe, function(req, res) {
  if (req.recipe == null) {
    res.send("no recipe matching username "+req.params.owner+" and recipe name "+req.params.recipename+" found.");
  }
  res.render('recipe', {recipe: JSON.stringify(req.recipe)});
});

//create new recipe from json in body of post request
app.post('/newrecipe', isLoggedIn, storage.addRecipe, function(req, res) {
  if (req.result == "added") {
    res.send("recipe added");
  } else if (req.result == "exists"){
    res.send("Unable to add recipe. Recipe already exists!");
  } else {
    res.send("Unable to add recipe. Recipe is incomplete!");
  }

});

app.get('/', isLoggedIn, function(req, res) {
  res.render('index', { username: req.user.username });
});

//render form for submitting new recipe
app.get('/newrecipe', isLoggedIn, function(req, res) {
  res.render('newrecipeform');
});

app.get('/recipes/:name', isLoggedIn, storage.findRecipesByName, function(req, res) {
  res.render('recipelist', { result: JSON.stringify(req.result) });
});

app.get('/yourrecipes', isLoggedIn, storage.getYourRecipes, function(req, res) {
  res.render('yourrecipes', { result: JSON.stringify(req.result) });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
  if(!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

app.listen(3000);
