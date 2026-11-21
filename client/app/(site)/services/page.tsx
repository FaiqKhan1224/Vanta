import Link from "next/link";
import CarImage from "@/components/CarImage";
import Reveal from "@/components/Reveal";
import { money, services } from "@/lib/data";

export default function Services() {
  return (
    <>
      <header className="page-hero"><Reveal><p className="eyebrow">Services</p><h1>Crafted for the exceptional</h1></Reveal></header>
      <section className="big"><Reveal><CarImage name="services-detailing" alt="Dark grey sports coupe in studio smoke with blue light streaks" className="wide" parallax eager /></Reveal></section>
      <section className="section">
        {services.map((s, i) => (
          <Reveal key={s.id} className="srow">
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <div><h2>{s.t}</h2><p className="muted">{s.d}</p></div>
            <div className="sright"><b>from {money(s.price)}</b><Link href={`/book?item=${s.id}`} className="link">Book →</Link></div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
