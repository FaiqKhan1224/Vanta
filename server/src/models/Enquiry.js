const { Schema, model } = require("mongoose");
module.exports = model("Enquiry", new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: String, email: String, phone: String, vehicle: String,
  service: String, date: String, message: String,
}, { timestamps: true }));
