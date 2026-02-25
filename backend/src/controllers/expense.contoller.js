const userModel = require("../model/user.model");

async function addExpense(req, res) {
  const { title, amount, date, paidBy } = req.body;

  try {
    // basic validation
    if (!title || !amount) {
      return res.status(400).json({
        message: "Title and amount are required"
      });
    }

    // find logged-in user
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // expense object
    const newExpense = {
      title,
      amount,
      date: date || new Date(),
      paidBy
    };

    // push expense
    user.expenses.push(newExpense);

    await user.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

module.exports = { addExpense };