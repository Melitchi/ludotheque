var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
// on utilise les sessions
app.use(session({secret: 'todotopsecret'}))
/**
 * Les routes de l'app
 */
app.get('/', function(req, res) {
  res.render('home.ejs');
})
.get('/consoles', function(req, res) {
  var consoles = ["n64","snes","ps1"];
  res.render('games/homeConsole.ejs', {consoles: consoles});
})
.get('/consoles/:console', function(req, res) {
  res.render('games/console.ejs',{console: req.params.console});
})
.get('/consoles/:console/:gameName', function(req, res) {
  res.render('games/game.ejs',{console: req.params.console,gameName: req.params.gameName});
})
/**
 * Si on ne trouve pas la route -> page 404
 */
.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable !');
});

app.listen(8080, function(){
  console.log("Listening on port 8080!")
});