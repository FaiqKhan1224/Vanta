const router = require("express").Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const { items, SLOTS } = require("../catalog");

router.use(auth);

const iso = (d) => d.toISOString().slice(0, 10);
const minDate = () => iso(new Date(Date.now() - 864e5)); // 1-day tolerance for time zones
const dateOk = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "") && !isNaN(Date.parse(d));
const makeId = () => "VNT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
const taken = async (date, time, excludeId) =>
  Booking.exists({ date, time, status: { $in: ["pending", "confirmed"] }, ...(excludeId ? { bookingId: { $ne: excludeId } } : {}) });

function checkSlot({ date, time }) {
  if (!dateOk(date)) return "Choose a valid date";
  if (date < minDate()) return "Date cannot be in the past";
  if (!SLOTS.includes(time)) return "Choose a time slot";
  return null;
}

// slots already taken on a date
router.get("/availability", async (req, res) => {
  if (!dateOk(req.query.date)) return res.status(400).json({ message: "Invalid date" });
  const q = { date: req.query.date, status: { $in: ["pending", "confirmed"] } };
  if (req.query.exclude) q.bookingId = { $ne: req.query.exclude };
  const rows = await Booking.find(q).select("time");
  res.json({ taken: rows.map((r) => r.time) });
});

router.get("/", async (req, res) => {
  await Booking.updateMany({ user: req.userId, status: "confirmed", date: { $lt: iso(new Date(Date.now() - 864e5)) } }, { status: "completed" });
  res.json({ bookings: await Booking.find({ user: req.userId }).sort({ createdAt: -1 }) });
});

router.get("/:id", async (req, res) => {
  const b = await Booking.findOne({ bookingId: req.params.id, user: req.userId });
  if (!b) return res.status(404).json({ message: "Booking not found" });
  res.json({ booking: b });
});

router.post("/", async (req, res) => {
  try {
    const { itemId, date, time, name, phone, email, notes } = req.body || {};
    const item = items[itemId];
    if (!item) return res.status(400).json({ message: "Select a service or package" });
    const slotErr = checkSlot({ date, time });
    if (slotErr) return res.status(400).json({ message: slotErr });
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });
    if (!/^[+\d][\d\s()-]{6,}$/.test(phone || "")) return res.status(400).json({ message: "Enter a valid phone number" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) return res.status(400).json({ message: "Enter a valid email" });
    if (await taken(date, time)) return res.status(409).json({ message: "That time slot has just been taken. Please choose another." });
    const booking = await Booking.create({
      bookingId: makeId(), user: req.userId, itemId, itemName: item.name, kind: item.kind, price: item.price,
      date, time, name: name.trim(), phone, email, notes: (notes || "").slice(0, 500), status: "confirmed",
    });
    res.status(201).json({ booking });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.patch("/:id/cancel", async (req, res) => {
  const b = await Booking.findOne({ bookingId: req.params.id, user: req.userId });
  if (!b) return res.status(404).json({ message: "Booking not found" });
  if (!["pending", "confirmed"].includes(b.status)) return res.status(400).json({ message: "This booking can no longer be cancelled" });
  b.status = "cancelled"; await b.save();
  res.json({ booking: b });
});

router.patch("/:id", async (req, res) => {
  const b = await Booking.findOne({ bookingId: req.params.id, user: req.userId });
  if (!b) return res.status(404).json({ message: "Booking not found" });
  if (!["pending", "confirmed"].includes(b.status)) return res.status(400).json({ message: "This booking cannot be rescheduled" });
  const { date, time } = req.body || {};
  const slotErr = checkSlot({ date, time });
  if (slotErr) return res.status(400).json({ message: slotErr });
  if (await taken(date, time, b.bookingId)) return res.status(409).json({ message: "That time slot is already booked" });
  b.date = date; b.time = time; await b.save();
  res.json({ booking: b });
});

module.exports = router;
