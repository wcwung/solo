var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var routes = require('./routes/index');
var users = require('./routes/user');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var keys = require('./keys');
var app = express();

/* FitBit API Keys */
var FITBIT_CONSUMER_KEY = keys.fitbit_consumer_key;
var FITBIT_CONSUMER_SECRET = keys.fitbit_consumer_key;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FitbitStrategy({
    consumerKey: FITBIT_CONSUMER_KEY,
    consumerSecret: FITBIT_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/fitbit/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Fitbit profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Fitbit account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// view engine setup

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

// GET /auth/fitbit
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Fitbit authentication will involve redirecting
//   the user to fitbit.com.  After authorization, Fitbit will redirect the user
//   back to this application at /auth/fitbit/callback
app.get('/auth/fitbit',
  passport.authenticate('fitbit'),
  function(req, res){
    // The request will be redirected to Fitbit for authentication, so this
    // function will not be called.
  });

app.get('/auth/fitbit/callback', 
  passport.authenticate('fitbit', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

/* sets and listens to port 8080 */
app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'));

module.exports = app;
