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
      router.push("/login");
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
              className="rounded-lg shadow-md p-4 bg-background border border-example-third_colour cursor-pointer"
              onClick={() => router.push(`/chat/${conflict.id}`)}
            >
              <h3 className="text-xl font-semibold text-foreground">
                {conflict.title}
              </h3>
              <p className="text-foreground mb-2">{conflict.description}</p>
              <p className="text-sm text-foreground">
                <strong className="text-example-third_colour">
                  Casualties:
                </strong>{" "}
                {conflict.casualties}
              </p>
              <p className="text-sm text-foreground">
                <strong className="text-example-third_colour">
                  Displacement:
                </strong>{" "}
                {conflict.displacement}
              </p>
              <p className="text-sm text-foreground mt-2">
                {conflict.basic_info}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
