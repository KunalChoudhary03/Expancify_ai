const express = require("express");
const controller = require("../controllers/room.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, controller.createRoom);
router.get("/", authMiddleware, controller.listRooms);
router.get("/:code", authMiddleware, controller.getRoom);
router.put("/:code", authMiddleware, controller.updateRoom);
router.delete("/:code", authMiddleware, controller.deleteRoom);
router.post("/:code/expense", authMiddleware, controller.addExpense);
router.get("/:code/balances", authMiddleware, controller.getBalances);

module.exports = router;
