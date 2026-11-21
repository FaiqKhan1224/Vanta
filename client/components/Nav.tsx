
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const links = [
  ["Home", "/home"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Packages", "/packages"],
  ["Gallery", "/gallery"],
  ["Reviews", "/reviews"],
  ["Book Appointment", "/book"],
  ["My Booking", "/my-booking"],
  ["Contact", "/contact"],
];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setCompact(window.scrollY > 40);

    f();
    window.addEventListener("scroll", f);

    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header className={`nav ${compact ? "compact" : ""}`}>
      <Link href="/home" className="logo" aria-label="VANTA Automotive Home">
        <Image
          src="/images/vanta-navbar-logo.png"
          alt="VANTA Automotive"
          width={220}
          height={65}
          priority
          style={{
            width: "190px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Link>

      <nav className={open ? "open" : ""}>
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={path === href ? "active" : ""}
          >
            {label}
          </Link>
        ))}

        <button
          className="linkbtn"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          Sign out
        </button>
      </nav>

      <button
        className={`burger ${open ? "x" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span />
        <span />
      </button>
    </header>
  );
}
