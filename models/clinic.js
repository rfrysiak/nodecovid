var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClinicSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true }
    }
);

//Export model
module.exports = mongoose.model('Clinic', ClinicSchema);