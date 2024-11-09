"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { FaAngleLeft } from "react-icons/fa";

export default function ConflictChatPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflict, setConflict] = useState(null);
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);

  const { id } = React.use(params); // Unwrap the params promise

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
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

  useEffect(() => {
    if (id) {
      const fetchThoughts = async () => {
        const res = await fetch(`/api/thoughts?conflictId=${id}`);
        const data = await res.json();
        setThoughts(data);
      };
      fetchThoughts();
    }
  }, [id]);

  const handlePostThought = async () => {
    if (thought.trim()) {
      const newThought = {
        conflictId: id,
        user: session?.user?.email || "Anonymous",
        text: thought,
      };

      const res = await fetch("/api/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newThought),
      });

      const savedThought = await res.json();
      setThoughts((prev) => [...prev, savedThought]);
      setThought("");
    }
  };

  if (status === "loading" || !conflict) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-foreground mb-4 hover:underline"
        >
          <FaAngleLeft className="mr-2" />
          Back to Dashboard
        </button>

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
              className="mt-2 h-8 px-4 rounded-full border border-foreground text-foreground text-xs flex items-center justify-center transition-colors hover:bg-foreground hover:text-background hover:border-transparent"
            >
              Post Thought
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
