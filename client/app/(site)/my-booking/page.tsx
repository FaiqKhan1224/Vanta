"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import CarImage from "@/components/CarImage";
import Modal from "@/components/Modal";
import Scheduler from "@/components/Scheduler";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { Booking, fmtDate, fmtTime, money, todayIso } from "@/lib/data";

const tabs = ["all", "upcoming", "completed", "cancelled"] as const;
type Tab = (typeof tabs)[number];
const active = (b: Booking) => b.status === "pending" || b.status === "confirmed";

export default function MyBooking() {
  const { token } = useAuth();
  const [list, setList] = useState<Booking[] | null>(null);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [view, setView] = useState<Booking | null>(null);
  const [cancel, setCancel] = useState<Booking | null>(null);
  const [resch, setResch] = useState<Booking | null>(null);
  const [date, setDate] = useState(""); const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false); const [mErr, setMErr] = useState(""); const [toast, setToast] = useState("");

  const load = useCallback(() => {
    if (!token) return;
    setErr("");
    api<{ bookings: Booking[] }>("/bookings", { token }).then((d) => setList(d.bookings)).catch((e) => setErr(e.message));
  }, [token]);
  useEffect(load, [load]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 4000); return () => clearTimeout(t); } }, [toast]);

  const shown = (list || []).filter((b) =>
    tab === "all" ? true : tab === "upcoming" ? active(b) && b.date >= todayIso() : b.status === tab);
  const replace = (b: Booking) => setList((l) => (l || []).map((x) => (x.bookingId === b.bookingId ? b : x)));

  async function doCancel() {
    if (!cancel) return; setBusy(true); setMErr("");
    try { const d = await api<{ booking: Booking }>(`/bookings/${cancel.bookingId}/cancel`, { method: "PATCH", token }); replace(d.booking); setCancel(null); setToast("Booking cancelled."); }
    catch (e) { setMErr((e as Error).message); }
    setBusy(false);
  }
  async function doResch() {
    if (!resch) return;
    if (!date || !time) return setMErr("Choose a new date and time");
    setBusy(true); setMErr("");
    try { const d = await api<{ booking: Booking }>(`/bookings/${resch.bookingId}`, { method: "PATCH", body: { date, time }, token }); replace(d.booking); setResch(null); setToast("Booking rescheduled."); }
    catch (e) { setMErr((e as Error).message); }
    setBusy(false);
  }
  const openResch = (b: Booking) => { setResch(b); setDate(b.date); setTime(b.time); setMErr(""); };

  return (
    <>
      <header className="page-hero mb-head">
        <div><p className="eyebrow">Your appointments</p><h1>My booking</h1><Link href="/book" className="btn blue" style={{ marginTop: "1.6rem" }}>Book appointment</Link></div>
        <CarImage name="booking-success" alt="Dark sports coupe parked beside a lit showroom with a night skyline" className="sq" eager />
      </header>
      <div className="filters" role="tablist">{tabs.map((t) => <button key={t} role="tab" aria-selected={t === tab} className={t === tab ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
      <section className="section mb-list">
        {toast && <p className="toast ok" role="status">{toast}</p>}
        {err && <p className="error" role="alert">{err} <button className="linkbtn" onClick={load}>Retry</button></p>}
        {!list && !err && <p className="muted">Loading your bookings…</p>}
        {list && !shown.length && (
          <div className="empty"><h3>{tab === "all" ? "No bookings yet" : `No ${tab} bookings`}</h3><p className="muted">When you book an appointment it will appear here.</p><Link href="/book" className="btn blue">Book appointment</Link></div>
        )}
        {shown.map((b) => (
          <article key={b.bookingId} className="bk">
            <div className="bk-top"><b>{b.bookingId}</b><span className={`badge ${b.status}`}>{b.status}</span></div>
            <h3>{b.itemName}</h3>
            <p className="muted">{fmtDate(b.date)} · {fmtTime(b.time)} · from {money(b.price)}</p>
            <p className="mini">Booked {new Date(b.createdAt).toLocaleDateString("en-GB")}</p>
            <div className="bk-actions">
              <button className="btn sm" onClick={() => setView(b)}>View details</button>
              {active(b) && <button className="btn sm" onClick={() => openResch(b)}>Reschedule</button>}
              {active(b) && <button className="btn sm danger" onClick={() => { setCancel(b); setMErr(""); }}>Cancel</button>}
              <Link className="btn sm" href={`/book?item=${b.itemId}`}>Book again</Link>
            </div>
          </article>
        ))}
      </section>

      {view && (
        <Modal title="Booking details" onClose={() => setView(null)}>
          <dl className="summary">
            {([["Booking ID", view.bookingId], ["Status", view.status], ["Service", view.itemName], ["Date", fmtDate(view.date)], ["Time", fmtTime(view.time)], ["Price", "from " + money(view.price)], ["Name", view.name], ["Phone", view.phone], ["Email", view.email], ["Notes", view.notes || "—"]] as string[][]).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Modal>
      )}
      {cancel && (
        <Modal title="Cancel this booking?" onClose={() => setCancel(null)}>
          <p className="muted">{cancel.itemName} on {fmtDate(cancel.date)} at {fmtTime(cancel.time)} will be cancelled and the slot released.</p>
          {mErr && <p className="error">{mErr}</p>}
          <div className="actions"><button className="btn danger" disabled={busy} onClick={doCancel}>{busy ? "Cancelling…" : "Yes, cancel booking"}</button><button className="btn" onClick={() => setCancel(null)}>Keep booking</button></div>
        </Modal>
      )}
      {resch && (
        <Modal title="Reschedule booking" onClose={() => setResch(null)}>
          <Scheduler date={date} time={time} onDate={setDate} onTime={setTime} excludeId={resch.bookingId} />
          {mErr && <p className="error">{mErr}</p>}
          <div className="actions"><button className="btn blue" disabled={busy} onClick={doResch}>{busy ? "Saving…" : "Save new time"}</button><button className="btn" onClick={() => setResch(null)}>Close</button></div>
        </Modal>
      )}
    </>
  );
}
