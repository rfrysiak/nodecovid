var User = require('../models/user');
var Clinic = require('../models/clinic');
var hash = require('pbkdf2-password')();
var config = require('../config.json');
var type = 'clinic';

const { body, validationResult } = require('express-validator');

// Display Clinic register form on GET.
exports.register_get = function (req, res, next) {
    res.render('clinic_form', { title: 'Rejestracja kliniki' });
};

// Handle Clinic register on POST.
exports.register_post = [

    // Validate and sanitize fields.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Podaj nazwę użytkownika.')
        .custom(value => {
            return User.findOne({ 'username': value }).then(user => {
                if (user) {
                    return Promise.reject('Podany login już istnieje.');
                }
            });
        }),
    body('password').isLength({ min: 5 }).withMessage('Hasło musi mieć co najmniej 5 znaków.'),
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Podaj nazwę kliniki.'),
    body('address').trim().isLength({ min: 1 }).escape().withMessage('Podaj adres kliniki.'),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('clinic_form', { title: 'Rejestracja kliniki', clinic: req.body, user: req.body, errors: errors.array() });
            return;
        }
        else {
            // Create an Clinic object.
            var clinic = new Clinic(
                {
                    name: req.body.name,
                    address: req.body.address
                });
            clinic.save(function (err) {
                if (err) { return next(err); }
                else {
                    // Create an User object.
                    hash({ password: req.body.password, salt: config.salt }, function (err, pass, salt, hash) {
                        if (err) throw err;
                        var user = new User(
                            {
                                username: req.body.username,
                                password: hash,
                                type: type,
                                type_id: clinic._id
                            });
                        user.save(function (err) {
                            if (err) { return next(err); }

                            // Successful - redirect to new clinic record.
                            res.redirect('/');
                        });
                    });
                }
            });
        }
    }
];

// Display User dashboard form on GET.
exports.dashboard_get = function (req, res) {
    res.render(
        'user_dashboard',
        {
            title: 'Express',
            sessid: req.session.id,
            username: req.session.username,
            display_name: req.body.name,
            type: type
        }
    );
};
