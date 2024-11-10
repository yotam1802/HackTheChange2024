import React from "react";

export default function Sidebar() {
  const continents = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"];

  return (
    <aside className="w-64 bg-background text-white p-4 h-screen sticky top-0">
      <h2 className="text-2xl font-bold mb-6 tracking-widest text-example-third_colour">
        Title
      </h2>
      <ul className="space-y-4">
        {continents.map((continent, index) => (
          <li key={index} className="flex items-center">
            <span className="text-example-third_colour mr-2">•</span>
            <span>{continent}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}