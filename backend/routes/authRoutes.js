const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const BlacklistToken = require("../models/BlacklistToken");

const router = express.Router();

const FRONTEND_URL = "http://localhost:3000";
const REDIRECT_PAGE = "/auth/callback";

// ĐĂNG KÝ 
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra tồn tại
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    // Mã hóa mật khẩu
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ĐĂNG NHẬP 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// đăng xuất
router.post("/logout", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
          await BlacklistToken.create({
            token,
            expiresAt: new Date(decoded.exp * 1000),
          });
        }
      } catch (e) {
        console.error("Lỗi khi blacklist token:", e.message);
      }
    }


    return res.json({ message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/google/callback",

  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(`${FRONTEND_URL}${REDIRECT_PAGE}?token=${token}`);
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",

  passport.authenticate("facebook", { failureRedirect: "/", session: false }),
  (req, res) => {

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });


    res.redirect(`${FRONTEND_URL}${REDIRECT_PAGE}?token=${token}`);
  }
);

module.exports = router;
