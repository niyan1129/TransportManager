const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const driverSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  licenceNumber: { type: String, required: true, unique: true },
}, 
{ timestamps: true });

driverSchema.plugin(mongoosePaginate); 

module.exports = mongoose.model("Driver", driverSchema);
