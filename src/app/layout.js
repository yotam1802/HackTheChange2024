"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";

import Head from "next/head";
import { Archivo } from "next/font/google";

// Add multiple weights for Kanit if you need more flexibility
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "700"] }); // Adjust weights as needed

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <Head>
          <title>Your Page Title</title>
          <meta name="description" content="Your page description" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body className={`${archivo.className} bg-background text-foreground`}>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
