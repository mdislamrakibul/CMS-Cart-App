var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../model/userModel');



module.exports = function (passport) {
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if(err) console.log(err);
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect Password.' });
                }
            })
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

