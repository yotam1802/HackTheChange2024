"use client";
import React from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg sm:text-xl text-center mb-6 max-w-2xl">
          Our platform is dedicated to raising awareness about global conflicts
          and providing resources for those affected. We aim to inform users
          about ongoing crises worldwide, allowing them to better understand the
          issues and support humanitarian efforts.
        </p>
        <p className="text-lg sm:text-xl text-center mb-8 max-w-2xl">
          With verified data, curated resources, and real-time updates, our goal
          is to bridge the gap between those who need help and those who can
          offer it. We invite you to explore our resources, stay informed, and
          join us in making a difference.
        </p>
        <a
          href="/contact"
          className="px-8 py-3 bg-third_color text-white rounded-lg text-lg font-semibold transition-transform transform hover:scale-105"
        >
          Contact Us
        </a>
      </main>
      <Footer />
    </div>
  );
}
