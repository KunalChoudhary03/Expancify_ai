const expenseModel = require("../model/expence.model");

async function addExpense(req, res) {
  try {
    const { title, amount, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        message: "Title and amount are required"
      });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0"
      });
    }

    const expense = await expenseModel.create({
      title,
      amount: numericAmount,
      date: date || new Date(),
      paidBy: req.user._id   // 👈 yaha se aayega
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

async function getExpenses(req, res) {
  try {
    const expenses = await expenseModel.find({ paidBy: req.user._id }).sort({ date: -1 });
    res.status(200).json({
      message: "Expenses retrieved successfully",
      expenses
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const { title, amount, date } = req.body;

    if (!title && !amount && !date) {
      return res.status(400).json({
        message: "At least one field (title, amount, date) is required to update"
      });
    }

    const expense = await expenseModel.findOne({
      _id: id,
      paidBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found or you are not authorized"
      });
    }

    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          message: "Amount must be greater than 0"
        });
      }
      expense.amount = numericAmount;
    }

    if (title !== undefined) expense.title = title;
    if (date !== undefined) expense.date = date;

    
    await expense.save();

    return res.status(200).json({
      message: "Expense updated successfully",
      expense
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const deletedExpense = await expenseModel.findOneAndDelete({
      _id: id,
      paidBy: req.user._id
    });
    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found or you are not authorized to delete it"
      });
    }
    res.status(200).json({
      message: "Expense deleted successfully",
      deletedExpense
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

async function getExpenseById(req, res) {
  try{
    const {id} = req.params;
    const expense = await expenseModel.findOne({_id:id, paidBy:req.user._id});
    if(!expense){
      return res.status(404).json({
        message:"Expense not found or you should not have access to it"
      });
    }
    res.status(200).json({
      message:"Expense retrieved successfully",
      expense
    });

  }
  catch(err){
    res.status(500).json({
      message:"Server error",
      error: err.message
    })
  }
}

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense, getExpenseById };
