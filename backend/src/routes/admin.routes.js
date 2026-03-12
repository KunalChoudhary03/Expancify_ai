const express = require('express');
const controller = require("../controllers/admin.controller")
const router = express.Router();



router.get("/user", controller.getUser)
router.get("/user/expense/:id", controller.getUserExpenseById)
router.get("/user/spend-summary", controller.getUserSpendSummary)

module.exports = router;