// Keep in sync with client/lib/data.ts
const items = {
  basic: { name: "Basic Package", price: 150, kind: "package" },
  premium: { name: "Premium Package", price: 350, kind: "package" },
  elite: { name: "Elite Package", price: 1200, kind: "package" },
  "car-detailing": { name: "Car Detailing", price: 250, kind: "service" },
  "paint-correction": { name: "Paint Correction", price: 450, kind: "service" },
  "ceramic-coating": { name: "Ceramic Coating", price: 700, kind: "service" },
  ppf: { name: "Paint Protection Film", price: 1800, kind: "service" },
  wrapping: { name: "Vehicle Wrapping", price: 2200, kind: "service" },
  tinting: { name: "Window Tinting", price: 180, kind: "service" },
  wheels: { name: "Wheel & Brake Customisation", price: 300, kind: "service" },
  modifications: { name: "Automotive Modifications", price: 500, kind: "service" },
};
const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
module.exports = { items, SLOTS };
