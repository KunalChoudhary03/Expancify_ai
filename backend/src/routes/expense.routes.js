const express = require('express');

const controller = require("../controllers/expense.contoller")
const authMiddleware = require("../middleware/auth.middleware")
const router = express.Router();

router.post("/add", authMiddleware, controller.addExpense);
router.get("/get", authMiddleware, controller.getExpenses);
router.get("/get/:id", authMiddleware, controller.getExpenseById);
router.put("/update/:id", authMiddleware, controller.updateExpense);
router.delete("/delete/:id", authMiddleware, controller.deleteExpense);

module.exports = router;