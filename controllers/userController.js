var User = require('../models/user');
var hash = require('pbkdf2-password')();
var config = require('../config.json');

// Display User login form on GET.
exports.login_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User login GET');
};

// Handle User logged on POST.
exports.login_post = function(req, res) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) res.send(err);
        if (user) {
            hash({ password: req.body.password, salt: config.salt }, function (err, pass, salt, hash) {
                if (err) res.send(err);
                if (hash === user.password) {
                    req.session.userid = user._id;
                    req.session.username = user.username;
                    res.redirect('/');
                }
                else {
                    res.send('Błędne hasło!');
                }
            }); 
        }
        else {
            res.send('Użytkownik nie istnieje!');
        }
    });
};

// Handle User logout on POST.
exports.logout_post = function(req, res) {
    req.session.destroy(function(){
        res.redirect('/');
    });
};