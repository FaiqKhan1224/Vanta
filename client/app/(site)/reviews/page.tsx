import CarImage from "@/components/CarImage";
import Reveal from "@/components/Reveal";
import ReviewCarousel from "@/components/ReviewCarousel";

export default function Reviews() {
  return (
    <>
      <header className="page-hero"><Reveal><p className="eyebrow">Reviews</p><h1>Trusted by those who demand more</h1></Reveal></header>
      <section className="bgsection tall">
        <CarImage name="testimonials" alt="Dark sports coupe with glowing headlights against a night city skyline" className="bgimg" eager />
        <Reveal className="inner"><ReviewCarousel /></Reveal>
      </section>
    </>
  );
}
