import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div><Link href="/home" className="logo">VANTA</Link><p>Automotive detailing, wrapping and modification studio.</p></div>
      <div><h4>Studio</h4><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/packages">Packages</Link><Link href="/gallery">Gallery</Link><Link href="/reviews">Reviews</Link><Link href="/book">Book Appointment</Link><Link href="/my-booking">My Booking</Link><Link href="/contact">Contact</Link></div>
      <div><h4>Contact</h4><span>+92 300 0000000</span><span>studio@vanta-auto.com</span><span>Mon – Sat, 9am – 6pm</span></div>
      <div><h4>Follow</h4><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">TikTok</a></div>
      <small>© {new Date().getFullYear()} VANTA Automotive Studio</small>
    </footer>
  );
}
