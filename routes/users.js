var express = require('express');
var router = express.Router();

// Required controller modules.
var patient_controller = require('../controllers/patientController');
var user_controller = require('../controllers/userController');

/* GET patient form. */
router.get('/patient', patient_controller.register_get);

/* POST patient form. */
router.post('/patient', patient_controller.register_post);

/* GET patient dashboard form. */
router.get('/patient/dashboard', patient_controller.dashboard_get);

/* GET patient campaign sing up form. */
router.get('/patient/signup_1/:id', patient_controller.signup_1_get);

/* Post patient campaign sing up form. */
router.post('/patient/signup_2/:id', patient_controller.signup_2_post);

/* Post patient campaign sing up form. */
router.post('/patient/signup_3/:id', patient_controller.signup_3_post);

var clinic_controller = require('../controllers/clinicController');

/* GET clinic form. */
router.get('/clinic', clinic_controller.register_get);

/* POST clinic form. */
router.post('/clinic', clinic_controller.register_post);

/* POST user login form. */
router.post('/login', user_controller.login_post);

/* POST user logout form. */
router.post('/logout', user_controller.logout_post);

module.exports = router;
