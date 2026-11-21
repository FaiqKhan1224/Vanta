"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";
import CarImage from "@/components/CarImage";
import Scheduler from "@/components/Scheduler";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { Booking, fmtDate, fmtTime, money, packages, services } from "@/lib/data";

const catalog = [...packages.map((p) => ({ id: p.id, name: `${p.t} Package`, price: p.price })), ...services.map((s) => ({ id: s.id, name: s.t, price: s.price }))];

export default function Book() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ itemId: "", name: user?.name || "", phone: "", email: user?.email || "", notes: "" });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [nonce, setNonce] = useState(0);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("item");
    if (q && catalog.some((c) => c.id === q)) setF((p) => ({ ...p, itemId: q }));
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (!f.itemId) e.itemId = "Select a service or package";
    if (!date) e.date = "Choose a date";
    if (date && !time) e.time = "Choose a time slot";
    if (!f.name.trim()) e.name = "Name is required";
    if (!/^[+\d][\d\s()-]{6,}$/.test(f.phone)) e.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email";
    setErrs(e);
    return !Object.keys(e).length;
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault(); setMsg("");
    if (!validate()) return;
    setBusy(true);
    try {
      const { booking } = await api<{ booking: Booking }>("/bookings", { method: "POST", body: { ...f, date, time }, token });
      router.push(`/booking-success/${booking.bookingId}`);
    } catch (x) { setMsg((x as Error).message); setTime(""); setNonce((n) => n + 1); setBusy(false); }
  }
  const sel = catalog.find((c) => c.id === f.itemId);
  const E = ({ k }: { k: string }) => (errs[k] ? <small className="error">{errs[k]}</small> : null);

  return (
    <>
      <header className="page-hero"><Reveal><p className="eyebrow">Book appointment</p><h1>Reserve your slot</h1></Reveal></header>
      <section className="section bookgrid">
        <Reveal>
          <form onSubmit={submit} noValidate>
            <label className="field"><span>Service or package</span>
              <select value={f.itemId} onChange={set("itemId")}>
                <option value="">Select…</option>
                <optgroup label="Packages">{catalog.slice(0, 3).map((c) => <option key={c.id} value={c.id}>{c.name} — from {money(c.price)}</option>)}</optgroup>
                <optgroup label="Services">{catalog.slice(3).map((c) => <option key={c.id} value={c.id}>{c.name} — from {money(c.price)}</option>)}</optgroup>
              </select><E k="itemId" /></label>
            <div><p className="mini">Date &amp; time</p>
              <Scheduler date={date} time={time} onDate={setDate} onTime={setTime} nonce={nonce} /><E k="date" /><E k="time" /></div>
            <label className="field"><span>Name</span><input value={f.name} onChange={set("name")} /><E k="name" /></label>
            <label className="field"><span>Phone</span><input type="tel" value={f.phone} onChange={set("phone")} /><E k="phone" /></label>
            <label className="field"><span>Email</span><input type="email" value={f.email} onChange={set("email")} /><E k="email" /></label>
            <label className="field"><span>Notes (optional)</span><textarea rows={3} maxLength={500} value={f.notes} onChange={set("notes")} placeholder="Vehicle model, special requests…" /></label>
            {sel && date && time && <p className="muted">{sel.name} · {fmtDate(date)} · {fmtTime(time)}</p>}
            {msg && <p className="error" role="alert">{msg}</p>}
            <button className="btn blue" disabled={busy}>{busy ? "Confirming…" : "Confirm booking"}</button>
          </form>
        </Reveal>
        <Reveal delay={200} className="bookart"><CarImage name="booking" alt="Rear three-quarter view of a grey sports coupe in studio smoke" className="sq" /></Reveal>
      </section>
    </>
  );
}
