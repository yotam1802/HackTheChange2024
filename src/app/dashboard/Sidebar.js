// /components/Sidebar.js

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Sidebar({ onScrollToSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "Antarctica",
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="w-full bg-background text-white sticky top-0 z-50">
      {/* Header for larger screens */}
      <div className="flex items-center justify-between p-4 md:px-24">
        <h2 className="text-xl font-bold tracking-widest text-example-third_colour mb-0">
          Go To Continent
        </h2>
        <div className="hidden lg:flex space-x-4">
          {continents.map((continent, index) => (
            <button
              key={index}
              className="hover:text-third_color transition-colors duration-300"
              onClick={() => onScrollToSection(continent)}
            >
              {continent}
            </button>
          ))}
        </div>

        {/* Hamburger Icon for smaller screens */}
        <button onClick={toggleMenu} className="lg:hidden focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar Drawer for mobile */}
      <div
        className={`fixed inset-y-0 left-0 bg-background w-64 p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <ul className="space-y-4">
          {continents.map((continent, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-third_color transition-colors duration-300"
              onClick={() => {
                onScrollToSection(continent);
                setIsOpen(false); // Close the drawer after selection
              }}
            >
              {continent}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
