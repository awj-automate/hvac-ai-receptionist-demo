import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HVAC AI Receptionist Demo · Apex Heating & Air",
  description:
    "Hear an AI receptionist answer a real HVAC call — live in your browser, as a recorded sample, and on the 24/7 operations dashboard.",
  openGraph: {
    title: "HVAC AI Receptionist Demo",
    description:
      "Hear the AI receptionist answer a real HVAC call. Live, recorded, and on the ops dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink-950 text-white antialiased">{children}</body>
    </html>
  );
}
