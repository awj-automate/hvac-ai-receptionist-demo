import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";

/* Face is DM Sans; the CSS variable keeps the `--font-jakarta` token
   name so design tokens stay shared with the datastaq-hvac project. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HVAC AI Receptionist Demo · DataStaq AI",
  description:
    "Hear an AI receptionist answer a real HVAC call — live in your browser, as a recorded sample, and on the 24/7 operations dashboard. A DataStaq AI demo.",
  openGraph: {
    title: "HVAC AI Receptionist Demo · DataStaq AI",
    description:
      "Hear the AI receptionist answer a real HVAC call. Live, recorded, and on the ops dashboard.",
    type: "website",
    siteName: "DataStaq AI",
  },
  // Icons are auto-wired by Next from app/favicon.ico, app/icon.svg and
  // app/apple-icon.png (content-hashed URLs — no stale-cache issues).
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="bg-ds-bg font-jakarta text-ds-text antialiased">
        {children}
      </body>
    </html>
  );
}
