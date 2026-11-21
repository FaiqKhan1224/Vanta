// Prices/ids must match server/src/catalog.js
export type Booking = {
  bookingId: string; itemId: string; itemName: string; kind: string; price: number;
  date: string; time: string; name: string; phone: string; email: string; notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled"; createdAt: string;
};

export const packages = [
  { id: "basic", t: "Basic", price: 150, tag: "Essential care", l: ["Exterior hand wash", "Interior refresh", "Wheel & tyre treatment", "Paint finish"] },
  { id: "premium", t: "Premium", price: 350, tag: "Most popular", hl: true, l: ["Deep exterior detail", "Interior deep clean", "Paint enhancement", "Premium finishing", "Glass & trim care"] },
  { id: "elite", t: "Elite", price: 1200, tag: "Complete protection", l: ["Multi-stage paint correction", "Ceramic coating", "Full exterior protection", "Interior leather treatment", "Concierge collection"] },
];

export const services = [
  { id: "car-detailing", t: "Car Detailing", d: "Deep exterior and interior detailing that restores every surface to showroom condition.", price: 250 },
  { id: "paint-correction", t: "Paint Correction", d: "Multi-stage machine polishing to restore gloss and remove swirls and imperfections.", price: 450 },
  { id: "ceramic-coating", t: "Ceramic Coating", d: "Long-term paint protection with a deep, hydrophobic finish.", price: 700 },
  { id: "ppf", t: "Paint Protection Film", d: "Self-healing film for the areas most vulnerable to road damage.", price: 1800 },
  { id: "wrapping", t: "Vehicle Wrapping", d: "Custom colours, finishes and complete transformations.", price: 2200 },
  { id: "tinting", t: "Window Tinting", d: "Premium tint films for privacy, comfort and heat rejection.", price: 180 },
  { id: "wheels", t: "Wheel & Brake Customisation", d: "Refinished wheels and calipers that sharpen the character of the car.", price: 300 },
  { id: "modifications", t: "Automotive Modifications", d: "Bespoke styling and exterior modifications tailored to the vehicle.", price: 500 },
];

export const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
export const money = (n: number) => "£" + n.toLocaleString("en-GB");
export const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
export const fmtTime = (t: string) => { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
export const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

export const studio = {
  phone: "+92 300 0000000", email: "studio@vanta-auto.com", address: "Studio Row, Lahore, Pakistan", hours: "Mon – Sat, 9am – 6pm",
  map: "https://www.openstreetmap.org/export/embed.html?bbox=74.3%2C31.49%2C74.42%2C31.57&layer=mapnik&marker=31.5204%2C74.3587",
};

export const gallery = [
  { t: "Headlight signature", s: "Full detail" }, { t: "Rear profile", s: "Ceramic protection" }, { t: "The garage", s: "Paint correction" },
  { t: "Wheel & caliper", s: "Wheel customisation" }, { t: "Cockpit", s: "Interior detail" }, { t: "City at night", s: "Gloss finish" },
];

export const reviews = [
  { q: "Exceptional attention to detail. The finish completely transformed my car.", n: "James R.", v: "Nissan GTR" },
  { q: "The satin wrap is flawless. Every edge, every panel, executed like a factory finish.", n: "Michael T.", v: "Porsche 911" },
  { q: "Meticulous from the first consultation to the final inspection. It has never looked better.", n: "Daniel K.", v: "BMW M4" },
  { q: "A complete transformation. Quiet confidence and true craftsmanship.", n: "Oliver S.", v: "Mercedes AMG" },
];
export const process = ["Consultation", "Vehicle Inspection", "Preparation", "Transformation", "Final Inspection"];
