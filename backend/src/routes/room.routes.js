const express = require("express");
const controller = require("../controllers/room.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, controller.createRoom);
router.get("/", authMiddleware, controller.listRooms);

// Expense routes MUST come before generic :code routes
router.post("/:code/expense", authMiddleware, controller.addExpense);
router.put("/:code/expense/:expenseId", authMiddleware, controller.editExpense);
router.delete("/:code/expense/:expenseId", authMiddleware, controller.deleteExpense);
router.get("/:code/balances", authMiddleware, controller.getBalances);

// Generic :code routes come LAST
router.get("/:code", authMiddleware, controller.getRoom);
router.put("/:code", authMiddleware, controller.updateRoom);
router.delete("/:code", authMiddleware, controller.deleteRoom);

module.exports = router;
