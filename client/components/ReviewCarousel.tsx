"use client";
import { useEffect, useState } from "react";
import { reviews } from "@/lib/data";

export default function ReviewCarousel() {
  const n = reviews.length;
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    if (pause) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 7000);
    return () => clearInterval(t);
  }, [pause, n]);
  const r = reviews[i];
  return (
    <div className="carousel" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      <button className="arrow" onClick={() => setI((i + n - 1) % n)} aria-label="Previous review">‹</button>
      <figure key={i} className="rcard" aria-live="polite">
        <div className="avatar" aria-hidden>{r.n.split(" ").map((x) => x[0]).join("")}</div>
        <div className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
        <blockquote>“{r.q}”</blockquote>
        <figcaption><b>{r.n}</b> — {r.v}</figcaption>
      </figure>
      <button className="arrow" onClick={() => setI((i + 1) % n)} aria-label="Next review">›</button>
      <div className="dots">{reviews.map((_, k) => <button key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} />)}</div>
    </div>
  );
}
