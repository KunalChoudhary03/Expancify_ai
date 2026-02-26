const express = require('express');

const controller = require("../controllers/expense.contoller")
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/add", authMiddleware, controller.addExpense);

module.exports = router;