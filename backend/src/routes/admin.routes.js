const express = require('express');
const controller = require("../controllers/admin.controller")
const router = express.Router();



router.get("/user", controller.getUser)
router.get("/user/expense/:id", controller.getUserExpenseById)
router.get("/user/spend-summary", controller.getUserSpendSummary)
router.get("/room", controller.getRooms)
router.get("/room/expense/:code", controller.getRoomExpenses)
router.delete("/room/:code", controller.deleteRoomAdmin)

module.exports = router;