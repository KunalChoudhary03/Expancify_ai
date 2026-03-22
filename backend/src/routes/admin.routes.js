const express = require('express');
const controller = require("../controllers/admin.controller")
const router = express.Router();



router.get("/user", controller.getUser)
router.get("/user/expense/:id", controller.getUserExpenseById)
router.get("/user/spend-summary", controller.getUserSpendSummary)
router.get("/circle", controller.getRooms)
router.get("/circle/expense/:code", controller.getRoomExpenses)
router.delete("/circle/:code", controller.deleteRoomAdmin)

module.exports = router;