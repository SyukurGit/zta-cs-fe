// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // Import provider yang baru dibuat

// ... (font config sama)

export const metadata: Metadata = {
  title: "ZTA Helpdesk",
  description: "Zero Trust Architecture Helpdesk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="...">
        {/* Wrap aplikasi dengan Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}