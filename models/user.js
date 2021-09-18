var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, enum: ['patient', 'clinic'], required: true },
    type_id: {type: Schema.Types.ObjectId, required: true },
    enabled: {type: Boolean, default: true}
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);