"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

// Smooth scroll behavior
useEffect(() => {
  document.querySelectorAll(".menuoption").forEach((option) => {
    option.addEventListener("click", function () {
      const targetSection = document.querySelector(this.dataset.target);
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}, []);


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect if not logged in
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/cache/conflicts.json");
      const data = await res.json();
      setConflicts(data);
    };

    fetchData();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Group conflicts by continent
  const continents = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"];
  const conflictsByContinent = continents.map((continent) => ({
    continent,
    conflicts: conflicts.filter((conflict) => conflict.continent === continent),
  }));

  return (
    <div className="min-h-screen bg-background flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 text-center sm:text-left">
            Welcome to the Dashboard!
          </h2>

          {/* Display conflicts grouped by continent */}
          {conflictsByContinent.map(({ continent, conflicts }) => (
            conflicts.length > 0 && ( // Only show section if there are conflicts for the continent
              <div key={continent} className="mb-12" id={continent}>
                <hr className="border-example-third_colour mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                  {continent}
                </h3>
                <hr className="border-example-third_colour mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conflicts.map((conflict) => (
                    <div
                      key={conflict.id}
                      onClick={() => router.push(`/chat/${conflict.id}`)}
                      className="rounded-lg shadow-lg hover:shadow-xl p-4 bg-background border border-example-third_colour transition-transform transform hover:scale-105 cursor-pointer"
                    >
                      <img
                        src={conflict.imageSrcUrl}
                        alt={conflict.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                        {conflict.title}
                      </h3>
                      <p className="text-sm sm:text-base text-foreground mb-2">
                        {conflict.description}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground mb-1">
                        <strong className="text-example-third_colour">Casualties:</strong> {conflict.casualties}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground mb-1">
                        <strong className="text-example-third_colour">Displacement:</strong> {conflict.displacement}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground mt-2">
                        {conflict.basic_info}
                      </p>
                      <h4 className="mt-4 font-semibold text-example-third_colour">Resources:</h4>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-example-third_colour">
                        {conflict.charities_resources.map((resource, index) => (
                          <li key={index}>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
