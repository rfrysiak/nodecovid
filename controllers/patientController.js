var User = require('../models/user');
var Patient = require('../models/patient');
var Campaign = require('../models/campaign');
var Vaccination = require('../models/vaccination');
var Questionary = require('../models/questionary');

var async = require('async');
var hash = require('pbkdf2-password')();
var config = require('../config.json');
var type = 'patient';

const { body,validationResult } = require('express-validator');
const { DateTime } = require("luxon");

// Display Patient register form on GET.
exports.register_get = function (req, res, next) {
    res.render('patient_form', { title: 'Rejestracja pacjenta' });
};

// Handle Patient register on POST.
exports.register_post = [

    // Validate and sanitize fields.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('Podaj nazwę użytkownika.')
        .custom(value => {
            return User.findOne({ 'username': value }).then(user => {
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
                    hash({ password: req.body.password, salt: config.salt }, function (err, pass, salt, hash) {
                        if (err) throw err;
                        var user = new User(
                            {
                                username: req.body.username,
                                password: hash,
                                type: type,
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
    async.parallel({
        patient_instance: function(callback) {
            Patient.findById(req.session.type_id).exec(callback);
        },
        vaccinations: function(callback) {
            Vaccination.find({ patient: req.session.type_id, done: false }).populate({ path: 'campaign', populate: { path: 'clinic' } }).exec(callback);
        },
        v_list: function(callback) {
            Vaccination.find({ patient: req.session.type_id, done: false }, 'campaign').distinct('campaign').exec(callback);
        },
        vaccinated: function(callback) {
            Vaccination.find({ patient: req.session.type_id, done: true }).populate('campaign').populate('vaccine').exec(callback);
        }
    }, function(err, results) {
        if (err) res.send(err);
        Campaign.find({ _id: { $nin: results.v_list }, enabled: true }).populate('clinic').exec(function(err, campaigns) {
            if (err) res.send(err);
            res.render('patient_dashboard', {
                title: 'Express',
                sessid: req.session.id,
                username: req.session.username,
                patient_instance: results.patient_instance,
                campaigns: campaigns,
                vaccinations: results.vaccinations,
                vaccinated: results.vaccinated
            });    
        });
    });
};

// Display Patient campaign sign up form on GET.
exports.signup_1_get = function(req, res) {
    Campaign.findById(req.params.id).exec(function(err, campaign) {
        if (err) res.send(err);
        var dates = [];
        var start_date = DateTime.fromJSDate(campaign.start_date);
        var end_date = DateTime.fromJSDate(campaign.end_date);
        while (start_date.toLocaleString(DateTime.DATE_SHORT) <= end_date.toLocaleString(DateTime.DATE_SHORT)) {
            dates.push(start_date.toLocaleString(DateTime.DATE_SHORT));
            start_date = start_date.plus({ days: 1 });
        }
        res.render('patient_signup_1_form', {
            title: 'Rejestracja na szczepienie',
            campaign_instance: campaign,
            dates_list: dates
        });
    });
};

// Display Patient campaign sign up form on POST.
exports.signup_2_post = function(req, res) {
    Campaign.findById(req.params.id).exec(function(err, campaign) {
        if (err) res.send(err);
        Vaccination.find( { date: { 
            $gte: DateTime.fromFormat(req.body.date, 'd.M.yyyy'),
            $lte: DateTime.fromFormat(req.body.date, 'd.M.yyyy').plus({ days: 1 })
        } }).exec(function(err, vaccinations) {
            if (err) res.send(err);
            if (vaccinations) {
                var taked = [];
                vaccinations.forEach(function(vac) {
                    taked.push(DateTime.fromJSDate(vac.date).toLocaleString(DateTime.TIME_SIMPLE));
                });
                var hours = [];
                var start_date = DateTime.fromFormat(req.body.date, 'd.M.yyyy').set({ hour: 10, minute:00 });
                for (var i = 0; i < 9; i++) {
                    hours.push(start_date.toLocaleString(DateTime.TIME_SIMPLE));
                    start_date = start_date.plus({ minutes: 30 });
                }
                for (const key in taked) {
                    var pos = hours.indexOf(taked[key]);
                    hours.splice(pos, 1);
                }
                res.render('patient_signup_2_form', {
                    title: 'Rejestracja na szczepienie',
                    campaign_instance: campaign,
                    hours_list: hours,
                    start_date: start_date.toLocaleString(DateTime.DATE_SHORT)
                });        
            }
        });
    });
};

// Display Patient campaign sign up form on POST.
exports.signup_3_post = function(req, res) {
    var questionary = new Questionary();
    questionary.save(function (err) {
        if (err) res.send(err);        
    });
    var vaccination = new Vaccination( {
        campaign: req.params.id,
        patient: req.session.type_id,
        questionary: questionary._id,
        date: DateTime.fromFormat(req.body.date + req.body.hour, 'd.M.yyyyHH:mm').toISO(),
    });
    vaccination.save(function (err) {
        if (err) { res.send(err); }
    });
    res.redirect('/users/patient/dashboard');
};

// Display Patient vaccination form on GET.
exports.signout_post = function (req, res) {
    Vaccination.findById(req.body.id).exec(function(err, vaccination) {
        if (err) res.send(err);
        if (vaccination) {
            Questionary.deleteOne({ _id: vaccination.questionary }).exec(function(err, questionary) {
                if (err) res.send(err);
            });
            Vaccination.deleteOne({ _id: vaccination._id}).exec(function(err, vaccination) {
                if (err) res.send(err);
            });
            res.redirect('/users/patient/dashboard');
        }
    });
};