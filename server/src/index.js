require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/bookings", require("./routes/bookings"));
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

if (!process.env.JWT_SECRET) { console.error("JWT_SECRET missing in .env"); process.exit(1); }
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vanta")
  .then(() => app.listen(process.env.PORT || 5000, () => console.log("API on port " + (process.env.PORT || 5000))))
  .catch((e) => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
