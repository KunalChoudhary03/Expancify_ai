const expenseModel = require("../model/expence.model");
const roomModel = require("../model/room.model");
const roomExpenseModel = require("../model/roomExpense.model");
const generateResponse = require("../services/ai.services");

async function generateContent(req, res) {
  try {
    const { roomCode } = req.body;

    let expenses = [];
    let promptTitle = "ANALYZE THESE USER EXPENSES STRICTLY:";

    if (roomCode) {
      const room = await roomModel.findOne({ code: roomCode, deleted: { $ne: true } });
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (room.createdBy?.toString() !== req.user._id?.toString()) {
        return res.status(403).json({ message: "Not allowed to access this room" });
      }

      expenses = await roomExpenseModel.find({ roomCode }).sort({ date: -1 });

      if (!expenses.length) {
        return res.status(404).json({
          message: "No room expenses found for analysis"
        });
      }

      const membersById = new Map((room.members || []).map((m) => [m.id, m.name]));
      promptTitle = `ANALYZE THESE ROOM EXPENSES STRICTLY (Room: ${room.name || room.code}):`;
      expenses = expenses.map((exp) => ({
        ...exp.toObject(),
        paidByLabel: membersById.get(exp.paidBy) || exp.paidBy,
      }));
    } else {
      expenses = await expenseModel.find({
        paidBy: req.user._id
      }).sort({ date: -1 });

      if (!expenses.length) {
        return res.status(404).json({
          message: "No expenses found for analysis"
        });
      }
    }

    const expenseList = expenses
      .map((exp) => {
        const payer = exp.paidByLabel ? ` [Paid by: ${exp.paidByLabel}]` : "";
        return `${exp.title}: ₹${exp.amount} on ${new Date(exp.date).toLocaleDateString()}${payer}`;
      })
      .join("\n");

    const prompt = `${promptTitle}

${expenseList}

RESPOND WITH EXACT FORMAT:
=== Expense Analysis ===
Summary: [brief overview]
Unnecessary Spending: [list wasteful items only]
Spending Patterns: [recurring wasteful patterns]
Smart Suggestions: [actionable cost cuts]
Estimated Monthly Savings Potential: [exact ₹ amount]`;

    // Call AI service
    const response = await generateResponse(prompt);

    res.status(200).json({
      message: "AI response generated successfully",
      response
    });

  } catch (err) {
    res.status(500).json({
      message: "Error generating AI response",
      error: err.message
    });
  }
}

module.exports = {
  generateContent
};