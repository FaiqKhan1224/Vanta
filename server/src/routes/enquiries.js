const router = require("express").Router();
const Enquiry = require("../models/Enquiry");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone, vehicle, service, date, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ message: "Name, email and message are required" });
    await Enquiry.create({ user: req.userId, name, email, phone, vehicle, service, date, message });
    res.status(201).json({ message: "Enquiry received" });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
