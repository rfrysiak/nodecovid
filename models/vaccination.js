var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VaccinationSchema = new Schema(
    {
        campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true},
        patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true},
        vaccine: { type: Schema.Types.ObjectId, ref: 'Vaccine', required: true},
        date: { type: Date, required: true },
        done: { type: Boolean, default: false}
    }
);

//Export model
module.exports = mongoose.model('Vaccination', VaccinationSchema);