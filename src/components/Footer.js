import React from "react";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-foreground py-8 mt-8 shadow-2xl">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and About */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">Conflict Awareness</h3>
          <p className="text-sm">
            A platform dedicated to raising awareness about ongoing global
            conflicts and providing resources to those affected.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/conflicts" className="hover:underline">
                Conflicts
              </a>
            </li>
            <li>
              <a href="/resources" className="hover:underline">
                Resources
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter className="text-xl hover:text-opacity-80 transition-opacity" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebook className="text-xl hover:text-opacity-80 transition-opacity" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram className="text-xl hover:text-opacity-80 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-background border-opacity-20 mt-6 pt-4 text-center text-sm">
        <p>&copy; 2024 Conflict Awareness. All rights reserved.</p>
      </div>
    </footer>
  );
}
