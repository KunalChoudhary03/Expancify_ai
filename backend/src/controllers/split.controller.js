const sharedExpenseModel = require("../model/sharedExpense.model");
const settlementModel = require("../model/settlement.model");
const userModel = require("../model/user.model");

function ensureUniqueParticipants(list) {
  return Array.from(new Set(list.map((id) => String(id))));
}

async function createSharedExpense(req, res) {
  try {
    const { title, amount, paidBy, participants, note, date } = req.body;

    if (!title || !amount || !paidBy || !participants || !participants.length) {
      return res.status(400).json({ message: "title, amount, paidBy, participants are required" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "amount must be a positive number" });
    }

    const uniqueParticipants = ensureUniqueParticipants([...participants, paidBy]);

    const expense = await sharedExpenseModel.create({
      title,
      amount: numericAmount,
      paidBy,
      participants: uniqueParticipants,
      note,
      date: date ? new Date(date) : undefined
    });

    return res.status(201).json({ message: "shared expense created", expense });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function createSettlement(req, res) {
  try {
    const { fromUser, toUser, amount, note, date } = req.body;

    if (!fromUser || !toUser || !amount) {
      return res.status(400).json({ message: "fromUser, toUser, amount are required" });
    }

    if (fromUser === toUser) {
      return res.status(400).json({ message: "fromUser and toUser must be different" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "amount must be a positive number" });
    }

    const settlement = await settlementModel.create({
      fromUser,
      toUser,
      amount: numericAmount,
      note,
      date: date ? new Date(date) : undefined
    });

    return res.status(201).json({ message: "settlement recorded", settlement });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function getBalances(req, res) {
  try {
    const users = await userModel.find({}).select("username email fullName");
    const expenses = await sharedExpenseModel.find({});
    const settlements = await settlementModel.find({});

    const netMap = new Map();

    const addNet = (userId, value) => {
      const key = String(userId);
      netMap.set(key, (netMap.get(key) || 0) + value);
    };

    // expenses contribution and splits
    for (const exp of expenses) {
      const shareCount = exp.participants.length || 1;
      const share = Number(exp.amount) / shareCount;

      addNet(exp.paidBy, Number(exp.amount));
      exp.participants.forEach((p) => addNet(p, -share));
    }

    // settlements adjust balances
    for (const s of settlements) {
      addNet(s.fromUser, -Number(s.amount));
      addNet(s.toUser, Number(s.amount));
    }

    const balances = users.map((u) => ({
      userId: String(u._id),
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      net: Number((netMap.get(String(u._id)) || 0).toFixed(2))
    }));

    const creditors = balances.filter((b) => b.net > 0).sort((a, b) => b.net - a.net);
    const debtors = balances.filter((b) => b.net < 0).sort((a, b) => a.net - b.net);

    const settlementsSuggested = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const owe = Math.abs(debtors[i].net);
      const owed = creditors[j].net;
      const pay = Math.min(owe, owed);

      settlementsSuggested.push({
        fromUser: debtors[i].userId,
        toUser: creditors[j].userId,
        amount: Number(pay.toFixed(2))
      });

      debtors[i].net += pay;
      creditors[j].net -= pay;

      if (Math.abs(debtors[i].net) < 0.01) i += 1;
      if (Math.abs(creditors[j].net) < 0.01) j += 1;
    }

    const totalSpentAll = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    return res.status(200).json({
      message: "balances calculated",
      balances,
      settlementsSuggested,
      totalSpentAll,
      expensesCount: expenses.length
    });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

module.exports = {
  createSharedExpense,
  createSettlement,
  getBalances
};
