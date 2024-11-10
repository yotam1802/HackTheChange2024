// layout.js
"use client"; // Mark this as a Client Component

import { Titillium_Web } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

// Configure Titillium Web with multiple available weights
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"], // Specify desired weights
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
