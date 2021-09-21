var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VaccineSchema = new Schema(
    {
        name: { type: String, required: true },
        series: { type: String, required: true },
        enabled: { type: Boolean, default: true }
    }
);

//Export model
module.exports = mongoose.model('Vaccine', VaccineSchema);