const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

async function authMiddleware(req, res, next) {
  try {
    // token header se lo
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user find karo
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // req.user set karo
    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message
    });
  }
}

module.exports = authMiddleware;