var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use(new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User.findOne({ 'username' :  username },
                function(err, user) {
                    if (err)
                        return done(err, {success: false, status: 500, message: 'Internal server error.'});
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, {success: false, status: 401, message: 'User not found with this username.'});
                    }
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, {success: false, status: 401, message: 'Invalid password.'});
                    }
										req.logIn(user, function(err) {
											if (err) {
												return done(err, {success: false, status: 500, message: 'Internal server error.'});
											}
											return done(null, user, {success: true});
										});
                }
            );
        })
    );
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
};
