var express = require('express');
var router = express.Router();

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};

// Registration POST

router.post('/register', passport.authenticate('signup', {
      successRedirect: '/profile',
      failureRedirect: '/register',
      failureFlash: true
}));


module.exports = router;
