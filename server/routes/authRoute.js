const express = require("express");
const { UserAuthModel } = require("../models/userAuthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlackListModule } = require("../models/blackListToken");
require("dotenv").config();

const userAuthRouter = express.Router();

// ✅ Register User
userAuthRouter.post("/register", async (req, res) => {
  const { userName, password, role } = req.body;
  if (!userName || !password || !role) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const userExists = await UserAuthModel.findOne({ userName });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAuthModel({ userName, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
});

// ✅ User Login
userAuthRouter.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await UserAuthModel.findOne({ userName });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Generate token without storing password hash
    const tokenPayload = { userName, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRETKEY, { expiresIn: "1h" });

    if (user.role === "admin") {
      return res.status(200).json({ msg: "Admin login successful", token, role: user.role, adminPanel: true });
    } else if (user.role === "user") {
      return res.status(200).json({ msg: "User login successful", token, role: user.role, dashboardAccess: true });
    } else {
      return res.status(400).json({ msg: "Invalid role assigned to user" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Error logging in", error });
  }
});




userAuthRouter.get("/logout", async (req, res) => {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, process.env.SECRETKEY, async (error, decode) => {
        if (error) {
          return res.status(400).json({ msg: "Invalid token" });
        }
        const isBlacklisted = await BlackListModule.findOne({ token });
  
        if (isBlacklisted) {
          return res
            .status(400)
            .json({ msg: "Token blacklisted, please log in again" });
        } else {
          await BlackListModule.create({ token });
  
          return res.status(200).json({ msg: "Logout Successfull." });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });
module.exports={userAuthRouter}