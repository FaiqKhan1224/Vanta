const { Schema, model } = require("mongoose");
module.exports = model("Booking", new Schema({
  bookingId: { type: String, unique: true, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  itemId: String, itemName: String, kind: String, price: Number,
  date: { type: String, required: true },  // YYYY-MM-DD
  time: { type: String, required: true },  // HH:mm
  name: String, phone: String, email: String, notes: String,
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "confirmed" },
}, { timestamps: true }));
