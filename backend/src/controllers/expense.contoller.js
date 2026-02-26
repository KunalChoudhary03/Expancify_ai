const userModel = require("../model/user.model");
const expenseModel = require("../model/expence.model");

async function addExpense(req, res) {
  const {email} = req.user
  const { title, amount, date,paidBy } = req.body;

  try {
    if (!title || !amount) {
      return res.status(400).json({
        message: "Title and amount are required"
      });
    }

    // req.user auth middleware se aata hai
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expense = await expenseModel.create({
      title,
      amount,
      date: date || new Date(),
      paidBy: user.username
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

module.exports = { addExpense };