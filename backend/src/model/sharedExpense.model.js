const mongoose = require("mongoose");

const sharedExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
  note: { type: String }
});

const sharedExpenseModel = mongoose.model("sharedExpense", sharedExpenseSchema);

module.exports = sharedExpenseModel;
