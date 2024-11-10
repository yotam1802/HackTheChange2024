"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { FaAngleLeft, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function ConflictChatPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflict, setConflict] = useState(null);
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);

  const { id } = React.use(params);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (id) {
      const fetchConflict = async () => {
        const res = await fetch("/cache/conflicts.json");
        const data = await res.json();
        setConflict(data.find((c) => parseInt(c.id) === parseInt(id)));
      };
      fetchConflict();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchThoughts = async () => {
        const res = await fetch(`/api/thoughts?conflictId=${id}`);
        const data = await res.json();
        setThoughts(
          data.sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes))
        );
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThought),
      });

      const savedThought = await res.json();
      setThoughts((prev) =>
        [...prev, savedThought].sort(
          (a, b) => b.likes - b.dislikes - (a.likes - a.dislikes)
        )
      );
      setThought("");
    }
  };

  const handleReaction = async (thoughtId, action) => {
    try {
      const res = await fetch("/api/thoughts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thoughtId, action }),
      });
      if (!res.ok) throw new Error("Failed to update reaction");

      const updatedThought = await res.json();
      setThoughts((prev) =>
        prev
          .map((thought) => {
            if (thought._id === thoughtId) {
              const updated = { ...thought };
              if (action === "like") updated.likes = (updated.likes || 0) + 1;
              if (action === "dislike")
                updated.dislikes = (updated.dislikes || 0) + 1;
              return updated;
            }
            return thought;
          })
          .sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes))
      );
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  if (status === "loading" || !conflict) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6">
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

        <div className="mt-4 bg-foreground bg-opacity-10 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <textarea
              className="w-full p-4 rounded-lg bg-background text-foreground border border-foreground border-opacity-30 focus:outline-none focus:border-opacity-70 transition-all"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Share your thoughts..."
              rows={1}
            />
            <button
              onClick={handlePostThought}
              className="h-12 px-6 rounded-lg text-background bg-foreground hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Post
            </button>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="text-2xl font-semibold text-foreground">
            Public Thoughts
          </h3>
          <ul className="mt-4 space-y-2">
            {thoughts.map((thought, index) => (
              <li
                key={index}
                className="p-2 rounded-md flex items-start space-x-4"
              >
                <div className="flex flex-col items-center space-y-1">
                  <button onClick={() => handleReaction(thought._id, "like")}>
                    <FaArrowUp className="text-lg" />
                  </button>
                  <span>{(thought.likes || 0) - (thought.dislikes || 0)}</span>
                  <button
                    onClick={() => handleReaction(thought._id, "dislike")}
                  >
                    <FaArrowDown className="text-lg" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{thought.user}</p>
                  {thought.text}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
