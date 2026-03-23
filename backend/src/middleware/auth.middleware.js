const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

async function authMiddleware(req, res, next) {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Alert: Unauthorized - No token" });
    }

    
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Alert: User not found" });
    }
    
    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Alert: Invalid or expired token",
      error: err.message
    });
  }
}

module.exports = authMiddleware;