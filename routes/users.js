var express = require('express');
var router = express.Router();

// Require controller modules.
var patient_controller = require('../controllers/patientController');

/* GET patient form. */
router.get('/patient', patient_controller.register_get);

/* POST patient form. */
router.post('/patient', patient_controller.register_post);

module.exports = router;
