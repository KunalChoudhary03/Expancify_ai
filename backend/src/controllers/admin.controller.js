const userModel = require("../model/user.model");
const expenseModel = require("../model/expence.model")
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

module.exports = {
    getUser,getUserExpenseById,getUserSpendSummary
}

