var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bCrypt = require('bcrypt-nodejs');

var User = require('./models/user');

var config = require('./config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var app = express();
app.use(express.static('public'));

// Run Server
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

// Passport Config
var passport = require('passport');
var expressSession = require('express-session');
var initPassport = require('./passport/init');
initPassport(passport);

app.use(expressSession({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

// Routes
app.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ 'username' :  username }, function(err, user) {
      if (err){
          console.log('Error in SignUp: '+err);
          return res.sendStatus(500);
      }
      if (user) {
          console.log('User already exists with username: '+username);
          return res.sendStatus(500);
      } else {
          console.log('attempting to create new user');
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);

          newUser.save(function(err) {
              if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
              }
              console.log('User Registration succesful');
              return res.sendStatus(200);
          });
      }
  });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.sendStatus(200);
});

app.get('/user/whiskies', function(req, res) {
    console.log("Req data: " + JSON.stringify(req.session.passport.user));
    res.sendStatus(200);
});



// Exports
exports.app = app;
exports.runServer = runServer;
