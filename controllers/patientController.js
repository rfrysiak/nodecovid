var User = require('../models/user');
var Patient = require('../models/patient');
var hash = require('pbkdf2-password')();
var config = require('../config.json');

const { body,validationResult } = require('express-validator');

// Display Patient register form on GET.
exports.register_get = function(req, res, next) {
    res.render('patient_form', { title: 'Rejestracja pacjenta' });
};

// Handle Patient register on POST.
exports.register_post = [

    // Validate and sanitize fields.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Podaj nazwę użytkownika.')
        .custom(value => {
            return User.findOne({'username': value}).then(user => {
                if (user) {
                    return Promise.reject('Nazwa użytkownika już istnieje.');
                }
            });
        }),
    body('password').isLength({ min: 5 }).withMessage('Hasło musi mieć co najmniej 5 znaków.'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('Podaj swoje imię.')
        .isAlphanumeric().withMessage('Imię może zawierać tylko litery.'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Podaj swoje nazwisko.')
        .isAlphanumeric().withMessage('Nazwisko może zawierać tylko litery.'),
    body('pesel').isLength(11).escape().withMessage('Wprowadź poprawnie swój PESEL.')
        .isNumeric().withMessage('PESEL może zawierać tylko cyfry.'),
    body('email').trim().isEmail().withMessage('Wprowadź poprawnie e-mail.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('patient_form', { title: 'Rejestracja pacjenta', patient: req.body, user: req.body, errors: errors.array() });
            return;
        }
        else {
            // Create an Patient object.
            var patient = new Patient(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    pesel: req.body.pesel,
                    email: req.body.email
                });
            patient.save(function (err) {
                if (err) { return next(err); }
                else {
                    // Create an User object.
                    hash({password: req.body.password, salt: config.salt}, function (err, pass, salt, hash) {
                        if (err) throw err;
                        var user = new User(
                            {
                                username: req.body.username,
                                password: hash,
                                type: 'patient',
                                type_id: patient._id
                            });
                        user.save(function (err) {
                            if (err) { return next(err); }
    
                            // Successful - redirect to new patient record.
                            res.redirect('/');
                        })
                    });
                }
            });
        }
    }
];

// Display Patient dashboard form on GET.
exports.dashboard_get = function(req, res) {
    res.render('patient_dashboard', { title: 'Express', sessid: req.session.id, username: req.session.username });
};