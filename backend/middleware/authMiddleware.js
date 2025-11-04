const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/BlacklistToken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Không có token" });

    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted)
      return res.status(401).json({ message: "Token đã bị thu hồi" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
