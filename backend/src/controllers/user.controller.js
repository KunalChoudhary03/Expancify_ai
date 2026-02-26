const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  const { username, email, password, fullName } = req.body;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      fullName
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}




async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function logoutUser(req, res) {
  res.status(200).json({ message: "Logout successful" });
}

module.exports = { registerUser, loginUser, logoutUser }