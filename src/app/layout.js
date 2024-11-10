// layout.js
"use client"; // Mark this as a Client Component

import { Titillium_Web } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

// Configure IBM Plex Sans with available weights
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["400"], // Specify available weights
});

export default function Layout({ children }) {
  return (
    <html lang="en" className={titillium.className}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
