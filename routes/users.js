var express = require('express');
var router = express.Router();

// Require controller modules.
var patient_controller = require('../controllers/patientController');

/* GET patient form. */
router.get('/patient', patient_controller.register_get);

/* POST patient form. */
router.post('/patient', patient_controller.register_post);

var clinic_controller = require('../controllers/clinicController');

/* GET clinic form. */
router.get('/clinic', clinic_controller.register_get);

/* POST clinic form. */
router.post('/clinic', clinic_controller.register_post);

module.exports = router;
