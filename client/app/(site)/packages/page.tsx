import Link from "next/link";
import CarImage from "@/components/CarImage";
import Reveal from "@/components/Reveal";
import { money, packages } from "@/lib/data";

export default function Packages() {
  return (
    <>
      <header className="page-hero"><Reveal><p className="eyebrow">Packages</p><h1>Choose your level of care</h1></Reveal></header>
      <section className="big"><Reveal><CarImage name="packages" alt="Grey sports coupe with red brake calipers in studio smoke" className="wide" eager /></Reveal></section>
      <section className="section packs">
        {packages.map((p, i) => (
          <Reveal key={p.id} delay={i * 150} className={`pcard ${p.hl ? "hl" : ""}`}>
            <p className="eyebrow">{p.tag}</p><h2>{p.t}</h2>
            <p className="from">From <b>{money(p.price)}</b></p>
            <ul>{p.l.map((x) => <li key={x}><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" /></svg>{x}</li>)}</ul>
            <Link href={`/book?item=${p.id}`} className={`btn full ${p.hl ? "blue" : ""}`}>Book now</Link>
          </Reveal>
        ))}
      </section>
      <section className="section">
        <Reveal><p className="muted note">Final pricing depends on vehicle size, condition, selected materials and scope of work. Specialist services are listed on the <Link className="link" href="/services">services page</Link>.</p></Reveal>
      </section>
    </>
  );
}
