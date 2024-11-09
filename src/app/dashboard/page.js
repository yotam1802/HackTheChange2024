"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

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
    // Fetch data from the JSON file
    const fetchData = async () => {
      const res = await fetch("/cache/conflicts.json");
      const data = await res.json();
      setConflicts(data);
    };

    fetchData();
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Welcome to the Dashboard!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className="border border-gray-300 rounded-lg shadow-md p-4 bg-white"
            >
              <img
                src={conflict.imageSrcUrl}
                alt={conflict.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold">{conflict.title}</h3>
              <p className="text-gray-700 mb-2">{conflict.description}</p>
              <p className="text-sm text-gray-500">
                <strong>Casualties:</strong> {conflict.casualties}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Displacement:</strong> {conflict.displacement}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {conflict.basic_info}
              </p>
              <h4 className="mt-4 font-semibold">Resources:</h4>
              <ul className="list-disc list-inside text-sm text-blue-600">
                {conflict.charities_resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
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
    </div>
  );
}
