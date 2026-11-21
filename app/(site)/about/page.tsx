import CarImage from "@/components/CarImage";
import Reveal from "@/components/Reveal";
import { process } from "@/lib/data";

export default function About() {
  return (
    <>
      <header className="page-hero"><Reveal><p className="eyebrow">About</p><h1>The craft behind the finish</h1></Reveal></header>
      <section className="big"><Reveal><CarImage name="showcase-silver" alt="Split view: the front of a black coupe beside its leather interior" className="wide" parallax eager /></Reveal></section>
      <section className="section split">
        <Reveal><h2>A studio built on obsession.</h2></Reveal>
        <Reveal delay={200}>
          <p className="muted">VANTA began with a simple passion for automotive craftsmanship. We work with premium materials and professional techniques, giving every vehicle the unhurried attention it deserves.</p>
          <p className="muted">From detailing to protection, our focus is the same: an exceptional result and an experience as refined as the finish itself.</p>
        </Reveal>
      </section>
      <section className="section">
        <Reveal><p className="eyebrow">Our process</p></Reveal>
        <div className="steps">{process.map((p, i) => <Reveal key={p} delay={i * 120} className="step"><span>{String(i + 1).padStart(2, "0")}</span><h3>{p}</h3></Reveal>)}</div>
      </section>
    </>
  );
}
