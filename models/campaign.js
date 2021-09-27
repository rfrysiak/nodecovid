var mongoose = require('mongoose');

const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var CampaignSchema = new Schema(
    {
        clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true},
        name: { type: String, required: true },
        description: { type: String },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        enabled: { type: Boolean, default: true }
    }
);

CampaignSchema
.virtual('start_date_formatted')
.get(function () {
    return DateTime.fromJSDate(this.start_date).toLocaleString(DateTime.DATE_SHORT);
});

CampaignSchema
.virtual('end_date_formatted')
.get(function () {
    return DateTime.fromJSDate(this.end_date).toLocaleString(DateTime.DATE_SHORT);
});

//Export model
module.exports = mongoose.model('Campaign', CampaignSchema);