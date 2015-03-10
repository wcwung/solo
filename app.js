var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/user');
var dashboard = require('./routes/dashboard');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var MovesStrategy = require('passport-moves').Strategy;
var FitbitApiClient = require('fitbit-node');
var keys = require('./keys');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
/* FitBit API Keys */
var FITBIT_CONSUMER_KEY = keys.fitbit_consumer_key;
var FITBIT_CONSUMER_SECRET = keys.fitbit_consumer_secret;

/* Moves API Keys */
var MOVES_CONSUMER_KEY = keys.moves_client_id;
var MOVES_CONSUMER_SECRET = keys.moves_secret_id;

passport.use(new FitbitStrategy({
    consumerKey: FITBIT_CONSUMER_KEY,
    consumerSecret: FITBIT_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/fitbit/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    console.log(profile.displayName);
    process.nextTick(function () {
      
      // To keep the example simple, the user's Fitbit profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Fitbit account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    })
   })
)

// passport.use(new MovesStrategy({
//     clientID: MOVES_CONSUMER_KEY,
//     clientSecret: MOVES_CONSUMER_SECRET
// }))

var app = express();

app.use(cookieParser());
app.use(session({secret: 'chicken nuggets'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());


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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);

/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: ge,
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


app.get('/dashboard', function(req, res){
    res.render('index', {user: req.user});
    // console.log(user);
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
    // console.log(req._passport.session);

    res.redirect('/dashboard');
  });

app.get('/userdata', function(req, res){
    res.send(req._passport.session);
});

/* sets and listens to port 3000 */
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = app;
