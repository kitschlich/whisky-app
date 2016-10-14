var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bCrypt = require('bcrypt-nodejs');

var User = require('./models/user');
var Whisky = require('./models/whisky');

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
          return res.status(500).json.json({
            message: 'Internal Server Error'
          });
      }
      if (user) {
          console.log('User already exists with username: '+username);
          return res.status(409).json({
            message: 'User already exists with that name.'
          });
      } else {
          console.log('attempting to create new user');
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);

          newUser.save(function(err) {
              if (err){
                  console.log('Error in Saving user: '+err);
                  return res.status(500).json.json({
                    message: 'Internal Server Error'
                  });
              }
              console.log('User Registration succesful');
              return res.sendStatus(200);
          });
      }
  });
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, response) {
       if(!response.success) {
         return res.status(response.status).json({
           message: response.message
         });
       }
       return res.sendStatus(200);
    })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  return res.sendStatus(200);
});

app.get('/user_data', function(req, res) {
  if (req.isAuthenticated()) {
    return res.json({
      username: req.user.username
    });
  }
  return res.json({});
});

app.get('/api/user/whiskies', function(req, res) {
  if (req.isAuthenticated()) {
    var user = req.user.username;

    Whisky.find({author: user}, function(err, whiskies) {
      if (err || !whiskies) {
        return res.status(500).json({
          message: 'Internal Server Error'
        });
      }
      console.log("Read whiskies for", user);
      res.json(whiskies);
    });
  } else {
    return res.sendStatus(403);
  }
});

app.post('/api/user/whiskies', function(req, res) {
  if (req.isAuthenticated()) {
    Whisky.findOne({ 'name' :  req.body.name }, function(err, whisky) {
        if (err){
            return res.status(500).json({
              message: 'Internal server error.'
            });
        }
        if (whisky) {
            return res.status(409).json({
              message: 'Whisky already exists with that name.'
            });
        } else {
            var newWhisky = new Whisky();
            newWhisky.author = req.user.username;
            newWhisky.attributes.name = req.body.name;
            newWhisky.attributes.style = req.body.style;
            newWhisky.attributes.date = req.body.date;
            newWhisky.attributes.age = req.body.age;
            newWhisky.attributes.proof = req.body.proof;
            newWhisky.attributes.pour_size = req.body.pour_size;
            newWhisky.attributes.bottle_size = req.body.bottle_size;
            newWhisky.attributes.price = req.body.price;
            newWhisky.attributes.establishment = req.body.establishment;
            newWhisky.attributes.nose = req.body.nose;
            newWhisky.attributes.flavor = req.body.flavor;
            newWhisky.attributes.finish = req.body.finish;
            newWhisky.attributes.score = req.body.score;

            newWhisky.save(function(err) {
                if (err){
                    console.log('Error in Saving whisky: '+err);
                    return res.sendStatus(500);
                }
                console.log('Whisky entry succesful with _id: ' + newWhisky._id);
                return res.sendStatus(200);
            });
        }
    });
    } else {
      return res.sendStatus(403);
    }
});

app.put('/api/user/whiskies/:id', function(req, res) {
  if (req.isAuthenticated()) {
    Whisky.findOneAndUpdate({ '_id':  req.params.id }, { 'attributes': req.body}, function(err, whisky) {
      console.log('attempting to update whisky with id: ' + req.params.id);
        if (err){
            console.log('Error updating whisky');
            return res.sendStatus(500);
        }
        if (!whisky) {
          console.log('No whisky found with that ID');
          return res.sendStatus(500);
        }
        console.log('Updated whisky');
        return res.sendStatus(200);
      });
  } else {
    return res.sendStatus(403);
  }
});

app.delete('/api/user/whiskies/:id', function(req, res) {
  if (req.isAuthenticated()) {
    Whisky.findOneAndRemove({'_id': req.params.id}, function(err, whisky) {
      if (err) {
        console.error('Error deleting whisky');
        return res.sendStatus(500);
      }
      if (!whisky) {
        console.log('No whisky found with that ID');
        return res.sendStatus(500);
      }
      console.log('Whisky deleted');
      return res.sendStatus(200);
    });
  } else {
    return res.sendStatus(403);
  }
});



// Exports
exports.app = app;
exports.runServer = runServer;
