"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SLOTS, fmtTime, todayIso } from "@/lib/data";
import { useAuth } from "./AuthProvider";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function Calendar({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const base = value ? new Date(value + "T00:00:00") : new Date();
  const [m, setM] = useState(new Date(base.getFullYear(), base.getMonth(), 1));
  const now = new Date(); const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const cells = [...Array(m.getDay()).fill(0), ...Array.from({ length: days }, (_, i) => i + 1)];
  const today = todayIso();
  return (
    <div className="calendar">
      <div className="cal-head">
        <button type="button" disabled={m <= thisMonth} onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))} aria-label="Previous month">‹</button>
        <b>{m.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</b>
        <button type="button" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))} aria-label="Next month">›</button>
      </div>
      <div className="cal-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="dow">{d}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const v = iso(new Date(m.getFullYear(), m.getMonth(), d));
          return <button type="button" key={i} disabled={v < today} className={v === value ? "on" : ""} onClick={() => onChange(v)} aria-pressed={v === value}>{d}</button>;
        })}
      </div>
    </div>
  );
}

export default function Scheduler({ date, time, onDate, onTime, excludeId, nonce = 0 }: { date: string; time: string; onDate: (d: string) => void; onTime: (t: string) => void; excludeId?: string; nonce?: number }) {
  const { token } = useAuth();
  const [taken, setTaken] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!date) { setTaken([]); return; }
    setLoading(true);
    api<{ taken: string[] }>(`/bookings/availability?date=${date}${excludeId ? `&exclude=${excludeId}` : ""}`, { token })
      .then((d) => { setTaken(d.taken); if (d.taken.includes(time)) onTime(""); })
      .catch(() => setTaken([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, excludeId, nonce, token]);
  return (
    <div className="scheduler">
      <Calendar value={date} onChange={(d) => { onDate(d); onTime(""); }} />
      <div>
        <p className="mini">{date ? "Available times" : "Select a date to see times"} {loading && "…"}</p>
        <div className="slots">
          {SLOTS.map((s) => <button type="button" key={s} disabled={!date || taken.includes(s)} className={s === time ? "on" : ""} onClick={() => onTime(s)} aria-pressed={s === time}>{fmtTime(s)}</button>)}
        </div>
      </div>
    </div>
  );
}
