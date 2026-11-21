import Link from "next/link";
import CarImage from "@/components/CarImage";
import Reveal from "@/components/Reveal";
import ReviewCarousel from "@/components/ReviewCarousel";
import { services } from "@/lib/data";

const why = [["01", "Premium Materials"], ["02", "Expert Craftsmanship"], ["03", "Attention to Detail"], ["04", "Bespoke Finishes"]];

export default function Home() {
  return (
    <>
      <section className="hero-full">
        <CarImage name="hero-main" alt="Black luxury coupe with glowing blue headlights outside an illuminated showroom at night" className="hero-bg" eager />
        <Reveal className="hero-copy">
          <h1>Luxury automotive detailing</h1>
          <p className="lead">Precision detailing, premium care packages and effortless appointment booking for those who expect nothing less than exceptional.</p>
          <div className="actions"><Link href="/book" className="btn blue">Book appointment</Link><Link href="/packages" className="btn glass">View packages <span aria-hidden="true">→</span></Link></div>
        </Reveal>
      </section>

      <section className="section split">
        <Reveal><p className="eyebrow">Luxury automotive detail</p><h2>Precision in every detail.</h2></Reveal>
        <Reveal delay={200}><p className="muted">VANTA is a private studio for premium detailing, protection and car care. Every vehicle receives unhurried, exacting attention — from the first inspection to the final reveal.</p></Reveal>
      </section>

      <section className="section row">
        <Reveal><CarImage name="services-detailing" alt="Dark grey sports coupe in studio smoke with blue light streaks" className="wide" /></Reveal>
        <Reveal delay={200}>
          <p className="eyebrow">Our services</p><h2>Care, refined.</h2>
          <ul className="why">{services.slice(0, 4).map((s) => <li key={s.id}><span>→</span><Link href={`/book?item=${s.id}`}>{s.t}</Link></li>)}</ul>
          <Link href="/services" className="link">All services →</Link>
        </Reveal>
      </section>

      <section className="big">
        <Reveal><CarImage name="showcase-silver" alt="Split view: the front of a black coupe beside its leather interior" className="wide" parallax /></Reveal>
        <Reveal className="overlay"><p className="eyebrow">The craft</p><h2>The art of automotive detail</h2><p className="muted">Light, surface and finish — refined until nothing is left to chance.</p></Reveal>
      </section>

      <section className="section split">
        <Reveal><p className="eyebrow">Why VANTA</p><h2>Obsessed with the finish.</h2></Reveal>
        <Reveal delay={200}><ul className="why">{why.map(([n, t]) => <li key={n}><span>{n}</span>{t}</li>)}</ul></Reveal>
      </section>

      <section className="bgsection">
        <CarImage name="testimonials" alt="Dark sports coupe with glowing headlights against a night city skyline" className="bgimg" />
        <Reveal className="inner"><p className="eyebrow">Reviews</p><h2>Trusted by those who demand more</h2><ReviewCarousel /></Reveal>
      </section>

      <section className="section center-cta">
        <Reveal><h2>Your car. Reimagined.</h2><p className="muted">From precision detailing to complete transformation.</p>
          <div className="actions"><Link href="/book" className="btn blue">Book appointment</Link><Link href="/contact" className="btn">Contact us</Link></div></Reveal>
      </section>
    </>
  );
}
