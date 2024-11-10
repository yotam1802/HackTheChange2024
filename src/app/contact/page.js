"use client";
import React from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg sm:text-xl text-center mb-8 max-w-lg">
          Have questions or need assistance? Please feel free to reach out, or
          visit the City of Calgary's official website for more information on
          public services, events, and resources.
        </p>
        <a
          href="https://www.ucalgary.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-third_color text-white rounded-lg text-lg font-semibold transition-transform transform hover:scale-105"
        >
          Visit ucalgary.ca
        </a>
      </main>
      <Footer />
    </div>
  );
}
