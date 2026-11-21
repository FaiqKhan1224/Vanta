"use client";
import { useEffect, useRef } from "react";

/* Renders /images/<name>.jpg (the supplied artwork). object-fit: cover, lazy-loaded. */
export default function CarImage({ name, alt, parallax, className = "", eager }: { name: string; alt: string; parallax?: boolean; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!parallax) return;
    const f = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--py", (r.top + r.height / 2 - innerHeight / 2) * -0.05 + "px");
    };
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, [parallax]);
  return (
    <div ref={ref} className={`car ${className}`}>
      <img src={`/images/${name}.jpg`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
    </div>
  );
}
