const jwt = require("jsonwebtoken");
const { BlackListModule } = require("../models/blackListToken");

const authMid = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    if (!token) {
      return res.status(400).json({ msg: "Token not found, please login" });
    }

    const isBlacklisted = await BlackListModule.findOne({ token });
    if (isBlacklisted) {
      return res.status(400).json({ msg: "Token blacklisted, login again" });
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY);

    req.user = decoded.username; 
    req.role = decoded.role; 
    console.log("Authenticated user:", decoded.username,decode.role);

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = { authMid };
