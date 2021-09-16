var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PatientSchema = new Schema(
  {
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    pesel: {type: Number, required: true},
    email: {type: String, required: true}
  }
);

//Export model
module.exports = mongoose.model('Patient', PatientSchema);