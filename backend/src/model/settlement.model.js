const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now }
});

const settlementModel = mongoose.model("settlement", settlementSchema);

module.exports = settlementModel;
