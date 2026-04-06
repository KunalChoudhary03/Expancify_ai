const mongoose = require("mongoose");

const roomExpenseSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, index: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paidBy: { type: String, required: true }, // member.id
  participants: { type: [String], required: true }, // member ids
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const roomExpenseModel = mongoose.model("roomExpense", roomExpenseSchema);

module.exports = roomExpenseModel;
