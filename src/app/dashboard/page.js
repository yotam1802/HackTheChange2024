"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 text-center sm:text-left">
          Welcome to the Dashboard!
        </h2>

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
              <h4 className="mt-4 font-semibold text-example-third_colour">
                Resources:
              </h4>
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
      <Footer />
    </div>
  );
}
