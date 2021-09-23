var mongoose = require('mongoose');

const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var VaccinationSchema = new Schema(
    {
        campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
        patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
        vaccine: { type: Schema.Types.ObjectId, ref: 'Vaccine' },
        date: { type: Date, required: true },
        done: { type: Boolean, default: false }
    }
);

VaccinationSchema
    .virtual('date_formatted')
    .get(function () {
        return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_SHORT);
    });

//Export model
module.exports = mongoose.model('Vaccination', VaccinationSchema);