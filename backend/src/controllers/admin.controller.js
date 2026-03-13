const userModel = require("../model/user.model");
const expenseModel = require("../model/expence.model");
const roomModel = require("../model/room.model");
const roomExpenseModel = require("../model/roomExpense.model");
async function getUser(req, res) {
    try {
        const users = await userModel.find({});

        return res.status(200).json({
            message: "users retrieved successfully",
            users
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "server error",
            err
        });
    }
}

async function getUserExpenseById(req, res) {
    try {
        const expenses = await expenseModel.find({ paidBy: req.params.id });

        if (!expenses || expenses.length === 0) {
            return res.status(404).json({
                message: "expense not found"
            });
        }

        return res.status(200).json({
            message: "expense retrieved Successfully",
            expenses
        });

    } catch (err) {
        return res.status(500).json({
            message: "server error",
            err
        });
    }
}

async function getUserSpendSummary(req, res) {
    try {
        const totals = await userModel.aggregate([
            {
                $lookup: {
                    from: "expenses",
                    localField: "_id",
                    foreignField: "paidBy",
                    as: "expenses"
                }
            },
            {
                $addFields: {
                    totalSpent: { $sum: "$expenses.amount" },
                    expenseCount: { $size: "$expenses" }
                }
            },
            {
                $project: {
                    userId: "$_id",
                    username: 1,
                    email: 1,
                    fullName: 1,
                    totalSpent: { $ifNull: ["$totalSpent", 0] },
                    expenseCount: { $ifNull: ["$expenseCount", 0] }
                }
            },
            { $sort: { totalSpent: -1, expenseCount: -1 } }
        ]);

        const totalSpentAll = totals.reduce((sum, item) => sum + (item.totalSpent || 0), 0);

        return res.status(200).json({
            message: "User spend summary retrieved successfully",
            totals,
            totalSpentAll
        });
    } catch (err) {
        return res.status(500).json({
            message: "server error",
            err
        });
    }
}

async function getRooms(req, res) {
    try {
        const rooms = await roomModel.aggregate([
            { $match: { deleted: { $ne: true } } },
            {
                $lookup: {
                    from: "roomexpenses",
                    localField: "code",
                    foreignField: "roomCode",
                    as: "expenses"
                }
            },
            {
                $addFields: {
                    expenseCount: { $size: "$expenses" },
                    totalSpent: { $sum: "$expenses.amount" },
                    memberCount: { $size: { $ifNull: ["$members", []] } }
                }
            },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    name: 1,
                    memberCount: 1,
                    expenseCount: 1,
                    totalSpent: { $ifNull: ["$totalSpent", 0] },
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return res.status(200).json({ message: "rooms retrieved", rooms });
    } catch (err) {
        return res.status(500).json({ message: "server error", err });
    }
}

async function getRoomExpenses(req, res) {
    try {
        const { code } = req.params;
        const room = await roomModel.findOne({ code });
        if (!room) return res.status(404).json({ message: "room not found" });
        if (room.deleted) return res.status(410).json({ message: room.deletedReason || "room deleted by admin" });

        const expenses = await roomExpenseModel.find({ roomCode: code }).sort({ createdAt: -1 });
        const membersById = new Map(room.members.map((m) => [m.id, m.name]));

        const detailed = expenses.map((exp) => ({
            id: exp._id,
            title: exp.title,
            amount: exp.amount,
            date: exp.date,
            paidBy: exp.paidBy,
            paidByName: membersById.get(exp.paidBy) || exp.paidBy,
            participants: exp.participants,
            participantNames: (exp.participants || []).map((p) => membersById.get(p) || p)
        }));

        return res.status(200).json({ message: "room expenses retrieved", expenses: detailed });
    } catch (err) {
        return res.status(500).json({ message: "server error", err });
    }
}

async function deleteRoomAdmin(req, res) {
    try {
        const { code } = req.params;
        const room = await roomModel.findOne({ code });
        if (!room) return res.status(404).json({ message: "room not found" });
        if (room.deleted) return res.status(410).json({ message: room.deletedReason || "room deleted by admin" });

        await roomExpenseModel.deleteMany({ roomCode: code });
        room.deleted = true;
        room.deletedByAdmin = true;
        room.deletedReason = "Room deleted by admin";
        room.deletedAt = new Date();
        await room.save();

        return res.status(200).json({ message: "room deleted by admin" });
    } catch (err) {
        return res.status(500).json({ message: "server error", err });
    }
}

module.exports = {
    getUser,
    getUserExpenseById,
    getUserSpendSummary,
    getRooms,
    getRoomExpenses,
    deleteRoomAdmin
}

