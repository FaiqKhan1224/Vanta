import Guard from "@/components/Guard";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <Guard><Nav />{children}<Footer /></Guard>;
}
