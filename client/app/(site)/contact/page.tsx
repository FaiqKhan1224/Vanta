"use client";
import { FormEvent, useState } from "react";
import Reveal from "@/components/Reveal";
import CarImage from "@/components/CarImage";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { studio } from "@/lib/data";

const I = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d={d} /></svg>;
const icons = { phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z", mail: "M3 6h18v12H3zM3 7l9 7 9-7", pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z", clock: "M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z" };

export default function Contact() {
  const { user, token } = useAuth();
  const empty = { name: user?.name || "", email: user?.email || "", phone: "", message: "" };
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      await api("/enquiries", { method: "POST", body: f, token });
      setMsg({ ok: true, t: "Thank you — your message has been sent. We will be in touch shortly." });
      setF({ ...empty, name: f.name, email: f.email });
    } catch (x) { setMsg({ ok: false, t: (x as Error).message }); }
    setBusy(false);
  }

  return (
    <>
      <header className="page-hero"><Reveal><p className="eyebrow">Contact</p><h1>Let’s talk about your car.</h1><p className="muted">Questions, quotes or special requests — send us a message.</p></Reveal></header>
      <section className="section contact">
        <Reveal>
          <form onSubmit={submit}>
            <label className="field"><span>Name</span><input value={f.name} onChange={set("name")} required /></label>
            <label className="field"><span>Email</span><input type="email" value={f.email} onChange={set("email")} required /></label>
            <label className="field"><span>Phone</span><input type="tel" value={f.phone} onChange={set("phone")} /></label>
            <label className="field"><span>Message</span><textarea rows={5} value={f.message} onChange={set("message")} required minLength={10} /></label>
            {msg && <p className={msg.ok ? "ok" : "error"} role="status">{msg.t}</p>}
            <button className="btn blue" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
          </form>
        </Reveal>
        <Reveal delay={200} className="info">
          <CarImage name="contact" alt="Rear view of a black sports coupe with red tail lights in blue smoke" className="sq" />
          <p><I d={icons.phone} /><span>Phone</span>{studio.phone}</p>
          <p><I d={icons.mail} /><span>Email</span>{studio.email}</p>
          <p><I d={icons.pin} /><span>Address</span>{studio.address}</p>
          <p><I d={icons.clock} /><span>Opening hours</span>{studio.hours}</p>
        </Reveal>
      </section>
      <section className="section">
        <Reveal><iframe className="map" title="Studio location map" src={studio.map} loading="lazy" /></Reveal>
      </section>
    </>
  );
}
