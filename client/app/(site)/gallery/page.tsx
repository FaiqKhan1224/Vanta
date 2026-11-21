"use client";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { gallery } from "@/lib/data";

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const n = gallery.length;
  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => ((o as number) + 1) % n);
      if (e.key === "ArrowLeft") setOpen((o) => ((o as number) + n - 1) % n);
    };
    addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, n]);
  return (
    <>
      <header className="page-hero"><Reveal><p className="eyebrow">Portfolio</p><h1>Selected work</h1></Reveal></header>
      <section className="gallery6">
        {gallery.map((g, i) => (
          <Reveal key={g.t} delay={i * 80}>
            <button className="gtile" onClick={() => setOpen(i)} aria-label={`Open ${g.t}`}>
              <img src={`/images/gallery-${i + 1}.jpg`} alt={`${g.t} — ${g.s}`} loading="lazy" decoding="async" />
              <span className="gcap"><b>{g.t}</b><em>{g.s}</em></span>
            </button>
          </Reveal>
        ))}
      </section>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[open].t} onClick={() => setOpen(null)}>
          <button className="lb-close" onClick={() => setOpen(null)} aria-label="Close">×</button>
          <button className="arrow lb-prev" onClick={(e) => { e.stopPropagation(); setOpen((open + n - 1) % n); }} aria-label="Previous">‹</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={`/images/gallery-${open + 1}.jpg`} alt={`${gallery[open].t} — ${gallery[open].s}`} />
            <figcaption>{gallery[open].t} · <span className="muted">{gallery[open].s}</span></figcaption>
          </figure>
          <button className="arrow lb-next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % n); }} aria-label="Next">›</button>
        </div>
      )}
    </>
  );
}
