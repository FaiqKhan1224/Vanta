"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CarImage from "@/components/CarImage";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { Booking, fmtDate, fmtTime, money } from "@/lib/data";

export default function Success() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [b, setB] = useState<Booking | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (token) api<{ booking: Booking }>(`/bookings/${id}`, { token }).then((d) => setB(d.booking)).catch((e) => setErr(e.message));
  }, [id, token]);
  return (
    <section className="success">
      <CarImage name="booking-success" alt="Dark sports coupe parked beside a lit showroom with a night skyline" className="sq" eager />
      <div>
        <p className="eyebrow">Confirmed</p>
        <h1>Your booking is confirmed</h1>
        {err && <p className="error">{err}</p>}
        {!b && !err && <p className="muted">Loading your booking…</p>}
        {b && (
          <dl className="summary">
            <div><dt>Booking ID</dt><dd>{b.bookingId}</dd></div>
            <div><dt>Service</dt><dd>{b.itemName}</dd></div>
            <div><dt>Date</dt><dd>{fmtDate(b.date)}</dd></div>
            <div><dt>Time</dt><dd>{fmtTime(b.time)}</dd></div>
            <div><dt>Name</dt><dd>{b.name}</dd></div>
            <div><dt>Estimated price</dt><dd>from {money(b.price)}</dd></div>
          </dl>
        )}
        <div className="actions"><Link href="/my-booking" className="btn blue">View my booking</Link><Link href="/home" className="btn">Back to home</Link></div>
      </div>
    </section>
  );
}
