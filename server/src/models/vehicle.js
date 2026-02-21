const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const vehicleSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: Number,
  
  //reference between vehicle and driver
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver"
  },
  plateNumber: {
    type: String,
    unique: true, 
    required: true
  }
  }, 
  { timestamps: true });

vehicleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Vehicle", vehicleSchema);
