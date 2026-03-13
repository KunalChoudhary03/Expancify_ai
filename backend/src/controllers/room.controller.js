const roomModel = require("../model/room.model");
const roomExpenseModel = require("../model/roomExpense.model");

function validMembers(members) {
  if (!Array.isArray(members)) return false;
  return members.every((m) => m && typeof m.id === "string" && typeof m.name === "string");
}

async function createRoom(req, res) {
  try {
    const { roomCode, roomName, members } = req.body;

    if (!roomCode) {
      return res.status(400).json({ message: "roomCode is required" });
    }

    if (members && !validMembers(members)) {
      return res.status(400).json({ message: "members must be array of {id,name}" });
    }

    const existing = await roomModel.findOne({ code: roomCode });
    if (existing) {
      if (existing.deleted) {
        return res.status(410).json({ message: existing.deletedReason || "room deleted by admin" });
      }
      return res.status(200).json({ message: "room already exists", room: existing });
    }

    const room = await roomModel.create({
      code: roomCode,
      name: roomName,
      members: members || [],
      createdBy: req.user?._id
    });

    return res.status(201).json({ message: "room created", room });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function listRooms(req, res) {
  try {
    const userId = req.user?._id;
    const filter = userId ? { createdBy: userId, deleted: { $ne: true } } : { deleted: { $ne: true } };
    const rooms = await roomModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ rooms, count: rooms.length });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function updateRoom(req, res) {
  try {
    const { code } = req.params;
    const { roomName, members } = req.body;

    const room = await roomModel.findOne({ code });
    if (!room) return res.status(404).json({ message: "room not found" });
    if (room.deleted) return res.status(410).json({ message: room.deletedReason || "room deleted by admin" });

    if (room.createdBy && room.createdBy.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }

    if (members && !validMembers(members)) {
      return res.status(400).json({ message: "members must be array of {id,name}" });
    }

    if (roomName) room.name = roomName;
    if (members) room.members = members;

    await room.save();
    return res.status(200).json({ message: "room updated", room });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function deleteRoom(req, res) {
  try {
    const { code } = req.params;
    const room = await roomModel.findOne({ code });
    if (!room) return res.status(404).json({ message: "room not found" });
    if (room.deleted) return res.status(410).json({ message: room.deletedReason || "room deleted by admin" });

    if (room.createdBy && room.createdBy.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }

    await roomExpenseModel.deleteMany({ roomCode: code });
    await room.deleteOne();

    return res.status(200).json({ message: "room deleted" });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function getRoom(req, res) {
  try {
    const { code } = req.params;
    const room = await roomModel.findOne({ code });
    if (!room) return res.status(404).json({ message: "room not found" });
    if (room.deleted) return res.status(410).json({ message: room.deletedReason || "room deleted by admin" });
    return res.status(200).json({ room });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function addExpense(req, res) {
  try {
    const { code } = req.params;
    const { title, amount, paidBy, participants, date } = req.body;

    const room = await roomModel.findOne({ code });
    if (!room) return res.status(404).json({ message: "room not found" });
    if (room.deleted) return res.status(410).json({ message: room.deletedReason || "room deleted by admin" });

    if (!title || !amount || !paidBy || !participants || !participants.length) {
      return res.status(400).json({ message: "title, amount, paidBy, participants are required" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "amount must be positive" });
    }

    const memberIds = room.members.map((m) => m.id);
    if (!memberIds.includes(paidBy)) {
      return res.status(400).json({ message: "paidBy must be a room member" });
    }
    const invalid = participants.find((p) => !memberIds.includes(p));
    if (invalid) {
      return res.status(400).json({ message: "all participants must be room members" });
    }

    const expense = await roomExpenseModel.create({
      roomCode: code,
      title,
      amount: numericAmount,
      paidBy,
      participants,
      date: date ? new Date(date) : undefined,
      createdBy: req.user?._id
    });

    return res.status(201).json({ message: "expense added", expense });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

async function getBalances(req, res) {
  try {
    const { code } = req.params;
    const room = await roomModel.findOne({ code });
    if (!room) return res.status(404).json({ message: "room not found" });
    if (room.deleted) return res.status(410).json({ message: room.deletedReason || "room deleted by admin" });

    const expenses = await roomExpenseModel.find({ roomCode: code });
    const membersById = new Map(room.members.map((m) => [m.id, m]));

    const netMap = new Map();
    const addNet = (id, value) => netMap.set(id, (netMap.get(id) || 0) + value);

    for (const exp of expenses) {
      const shareCount = exp.participants.length || 1;
      const share = Number(exp.amount) / shareCount;
      addNet(exp.paidBy, Number(exp.amount));
      exp.participants.forEach((p) => addNet(p, -share));
    }

    const balances = room.members.map((m) => ({
      id: m.id,
      name: m.name,
      net: Number((netMap.get(m.id) || 0).toFixed(2))
    }));

    const expensesDetailed = expenses.map((exp) => ({
      id: exp._id,
      title: exp.title,
      amount: Number(exp.amount || 0),
      paidBy: exp.paidBy,
      paidByName: membersById.get(exp.paidBy)?.name || exp.paidBy,
      participants: exp.participants,
      participantNames: exp.participants.map((p) => membersById.get(p)?.name || p),
      date: exp.date,
    }));

    const creditors = balances
      .filter((b) => b.net > 0)
      .map((b) => ({ ...b }))
      .sort((a, b) => b.net - a.net);
    const debtors = balances
      .filter((b) => b.net < 0)
      .map((b) => ({ ...b }))
      .sort((a, b) => a.net - b.net);

    const settlementsSuggested = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const owe = Math.abs(debtors[i].net);
      const owed = creditors[j].net;
      const pay = Math.min(owe, owed);
      settlementsSuggested.push({
        fromId: debtors[i].id,
        toId: creditors[j].id,
        amount: Number(pay.toFixed(2))
      });
      debtors[i].net += pay;
      creditors[j].net -= pay;
      if (Math.abs(debtors[i].net) < 0.01) i += 1;
      if (Math.abs(creditors[j].net) < 0.01) j += 1;
    }

    const totalSpentAll = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    return res.status(200).json({
      room: { code: room.code, name: room.name, members: room.members },
      balances,
      settlementsSuggested,
      totalSpentAll,
      expensesCount: expenses.length,
      expenses: expensesDetailed
    });
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
}

module.exports = {
  createRoom,
  getRoom,
  addExpense,
  getBalances,
  listRooms,
  updateRoom,
  deleteRoom
};
