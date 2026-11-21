import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--f-serif" });
const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--f-sans" });

export const metadata: Metadata = {
  title: "VANTA — Automotive Studio",
  description: "Luxury automotive detailing, wrapping and modification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
