const express = require("express");
const controller = require("../controllers/user.controller")
const authMiddleware = require("../middleware/auth.middleware")
const router = express.Router();

router.post("/register", controller.registerUser)
router.post("/login", controller.loginUser)
router.post("/logout", authMiddleware, controller.logoutUser)

module.exports = router;