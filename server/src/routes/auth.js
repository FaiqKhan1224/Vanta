const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const pub = (u) => ({ id: u._id, name: u.name, email: u.email });
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });
    if (!emailOk(email || "")) return res.status(400).json({ message: "Enter a valid email" });
    if (!password || password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "An account with this email already exists" });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = email && (await User.findOne({ email: String(email).toLowerCase() }));
    if (!user || !(await bcrypt.compare(password || "", user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: "User not found" });
  res.json({ user: pub(user) });
});

module.exports = router;
