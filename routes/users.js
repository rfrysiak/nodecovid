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

/* POST user login form. */
router.post('/login', user_controller.login_post);

/* POST user logout form. */
router.post('/logout', user_controller.logout_post);

module.exports = router;