const express = require("express");
const controller = require("../controllers/split.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/expense", authMiddleware, controller.createSharedExpense);
router.post("/settle", authMiddleware, controller.createSettlement);
router.get("/balances", authMiddleware, controller.getBalances);

module.exports = router;
