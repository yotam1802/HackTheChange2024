"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function ConflictChatPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflict, setConflict] = useState(null);
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);

  // Await `params` with React.use
  const { id } = React.use(params);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      // Check if `id` is loaded before fetching data
      const fetchConflict = async () => {
        const res = await fetch(`/cache/conflicts.json`);
        const data = await res.json();
        const selectedConflict = data.find(
          (c) => parseInt(c.id) === parseInt(id)
        );
        setConflict(selectedConflict);
      };

      fetchConflict();
    }
  }, [id]);

  const handlePostThought = () => {
    if (thought.trim()) {
      const newThought = {
        user: session?.user?.name || "Anonymous",
        text: thought,
      };
      setThoughts((prev) => [...prev, newThought]);
      setThought("");
    }
  };

  if (status === "loading" || !conflict) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold text-foreground my-4">
          {conflict.title}
        </h2>
        <p className="text-foreground mb-2">{conflict.description}</p>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-foreground">
            Public Thoughts
          </h3>
          <ul className="mt-4">
            {thoughts.map((thought, index) => (
              <li
                key={index}
                className="mb-2 p-2 border border-example-third_colour rounded-md"
              >
                <strong>{thought.user}:</strong> {thought.text}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <textarea
              className="w-full p-2 border border-example-third_colour rounded-md bg-transparent"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Share your thoughts..."
            />
            <button
              onClick={handlePostThought}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Post Thought
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
