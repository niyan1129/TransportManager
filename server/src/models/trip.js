const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

//reference between trip and driver&vehicle
const tripSchema = new Schema({
    driver:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'Driver',
        required: true
    },

    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },

    startLocation: String,
    endLocation: String,
    startTime: Date,
    endTime: Date
}, 
{ timestamps: true});

tripSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Trip", tripSchema);