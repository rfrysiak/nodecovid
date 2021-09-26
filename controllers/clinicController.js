var User = require('../models/user');
var Clinic = require('../models/clinic');
var hash = require('pbkdf2-password')();
var config = require('../config.json');
var type = 'clinic';

var Campaign = require('../models/campaign');
var Vaccination = require('../models/vaccination');
var Questionary = require('../models/questionary');

var async = require('async');


const {
    body,
    validationResult
} = require('express-validator');

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
    async.parallel({
        clinic_instance: function (callback) {
            Clinic.findById(req.session.type_id).exec(callback);
        }
    }, function (err, results) {
        res.render(
            'clinic_dashboard', {
            title: 'Express',
            sessid: req.session.id,
            username: req.session.username,
            clinic_instance: results.clinic_instance,
            type: type
        });
    });
};


// Display Campaign creation form on GET.
exports.campaign_create_get = function (req, res, next) {
    res.params.clinic_id = req.params.clinic_id;
    res.render('campaign_form', { title: 'Tworzenie kampanii' });
};
// Handle Campaign creation on POST.
exports.campaign_create_post = [

    // Validate and sanitize fields.
    body('campaign').trim().isLength({ min: 1 }).escape().withMessage('Podaj nazwę kampanii.')
        .custom(value => {
            return Clinic.findOne({ 'name': value }).then(user => {
                if (user) {
                    return Promise.reject('Podana nazwa kampanii już istnieje.');
                }
            });
        }),
    body('desciption').isLength({ min: 10 }).withMessage('Opis musi mieć co najmniej 10 znaków.'),
    // body('start_date').trim().isLength({ min: 1 }).escape().withMessage('Podaj datę początkową.'),
    // body('end_date').trim().isLength({ min: 1 }).escape().withMessage('Podaj datę końcową.'),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('campaign_form', { title: 'Tworzenie kampanii', clinic: req.body, user: req.body, errors: errors.array() });
            return;
        }
        else {
            var campaign = new Campaign(
                {
                    clinic: req.params.clinic_id,
                    name: req.body.name,
                    description: req.body.description,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date
                });
            campaign.save((err) => {
                if (err) { return next(err); }
                res.redirect('/clinic');
            });
        }
    }
];
// Formularz kampanii szczepień
// wyświetl listę kampanii i dodaj / usuń z niej pacjentów
// dla każdej kampanii wyświetlana jest też szczepionka (można dodawać / usuwać szczepionki)