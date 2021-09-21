var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CampaignSchema = new Schema(
    {
        clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true},
        name: { type: String, required: true },
        description: { type: String },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true }
    }
);

//Export model
module.exports = mongoose.model('Campaign', CampaignSchema);