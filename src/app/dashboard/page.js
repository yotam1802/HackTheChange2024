"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import {
  FaGlobeAfrica,
  FaGlobeAsia,
  FaGlobeEurope,
  FaGlobeAmericas,
} from "react-icons/fa";
import { GiIsland } from "react-icons/gi";
import { WiSnowflakeCold } from "react-icons/wi";

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

  const truncateText = (text, wordLimit = 50) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const onScrollToSection = (continent) => {
    const targetSection = document.getElementById(continent);
    const headerOffset = 80;

    if (targetSection) {
      const elementPosition =
        targetSection.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const gradients = {
    Africa: "from-blue-500 to-purple-500",
    Asia: "from-green-400 to-teal-500",
    Europe: "from-red-500 to-orange-500",
    "North America": "from-yellow-500 to-pink-500",
    "South America": "from-purple-500 to-indigo-500",
    Oceania: "from-teal-500 to-blue-500",
    Antarctica: "from-purple-500 to-indigo-500",
  };

  const icons = {
    Africa: <FaGlobeAfrica className="text-foreground text-2xl mr-2" />,
    Asia: <FaGlobeAsia className="text-foreground text-2xl mr-2" />,
    Europe: <FaGlobeEurope className="text-foreground text-2xl mr-2" />,
    "North America": (
      <FaGlobeAmericas className="text-foreground text-2xl mr-2" />
    ),
    "South America": (
      <FaGlobeAmericas className="text-foreground text-2xl mr-2" />
    ),
    Oceania: <GiIsland className="text-foreground text-2xl mr-2" />,
    Antarctica: <WiSnowflakeCold className="text-foreground text-2xl mr-2" />,
  };

  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "Antarctica",
  ];

  const conflictsByContinent = continents.map((continent) => ({
    continent,
    conflicts: conflicts.filter((conflict) => conflict.continent === continent),
  }));

  return (
    <div className="min-h-screen bg-background flex-col">
      <Navbar />
      <Sidebar onScrollToSection={onScrollToSection} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 text-center sm:text-left">
          Welcome to the Dashboard!
        </h2>

        {conflictsByContinent.map(
          ({ continent, conflicts }) =>
            conflicts.length > 0 && (
              <div key={continent} className="mb-12" id={continent}>
                <hr
                  className={`bg-gradient-to-r ${gradients[continent]} h-1 mb-4`}
                />
                <div className="flex items-center justify-center mb-4 text-xl font-semibold text-foreground">
                  {icons[continent]} {continent}
                </div>
                <hr
                  className={`bg-gradient-to-r ${gradients[continent]} h-1 mb-6`}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conflicts.map((conflict) => (
                    <div
                      key={conflict.id}
                      onClick={() => router.push(`/chat/${conflict.id}`)}
                      className="p-[1px] rounded-lg border-transparent transition-transform transform hover:scale-105 cursor-pointer bg-background"
                    >
                      <div
                        className={`rounded-lg shadow-lg hover:shadow-xl p-1 bg-background border border-transparent hover:border-0 hover:bg-gradient-to-r ${gradients[continent]}`}
                      >
                        <div className="bg-background rounded-lg p-4">
                          <img
                            src={conflict.imageSrcUrl}
                            alt={conflict.title}
                            className="w-full h-48 object-cover rounded-md mb-4"
                          />
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                            {conflict.title}
                          </h3>
                          <p className="text-sm sm:text-base text-foreground mb-2">
                            {truncateText(conflict.description)}
                          </p>
                          <p className="text-xs sm:text-sm text-foreground mb-1">
                            <strong className="text-example-third_colour">
                              Casualties:
                            </strong>{" "}
                            {conflict.casualties}
                          </p>
                          <p className="text-xs sm:text-sm text-foreground mb-1">
                            <strong className="text-example-third_colour">
                              Displacement:
                            </strong>{" "}
                            {conflict.displacement}
                          </p>
                          <p className="text-xs sm:text-sm text-foreground mt-2">
                            {conflict.basic_info}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
      <Footer />
    </div>
  );
}
