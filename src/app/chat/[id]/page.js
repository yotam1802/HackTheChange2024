"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaAngleLeft,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

export default function ConflictChatPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conflict, setConflict] = useState(null);
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [collapsedReplies, setCollapsedReplies] = useState({});

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

  const toggleCollapse = (thoughtId) => {
    setCollapsedReplies((prev) => ({
      ...prev,
      [thoughtId]: !prev[thoughtId],
    }));
  };

  const handlePostThought = async () => {
    if (thought.trim()) {
      const newThought = {
        conflictId: id,
        user: session?.user?.email || "Anonymous",
        text: thought,
        parentThoughtId: replyTo,
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
      setReplyTo(null);
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

  const handleReplyChange = (thoughtId, text) => {
    setReplyText((prev) => ({ ...prev, [thoughtId]: text }));
  };

  const handlePostReply = async (thoughtId) => {
    if (replyText[thoughtId]?.trim()) {
      const newReply = {
        conflictId: id,
        user: session?.user?.email || "Anonymous",
        text: replyText[thoughtId],
        parentThoughtId: thoughtId,
      };

      const res = await fetch("/api/thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReply),
      });

      const savedReply = await res.json();
      setThoughts((prev) =>
        [...prev, savedReply].sort(
          (a, b) => b.likes - b.dislikes - (a.likes - a.dislikes)
        )
      );
      setReplyText((prev) => ({ ...prev, [thoughtId]: "" }));
      setReplyTo(null);
    }
  };

  const renderThoughts = (thoughts, parentId = null) =>
    thoughts
      .filter((thought) => thought.parentThoughtId === parentId)
      .map((thought) => (
        <li
          key={thought._id}
          className="p-2 rounded-md flex items-start space-x-4"
        >
          <div className="flex flex-col items-center space-y-1">
            <button onClick={() => handleReaction(thought._id, "like")}>
              <FaArrowUp className="text-lg" />
            </button>
            <span>{(thought.likes || 0) - (thought.dislikes || 0)}</span>
            <button onClick={() => handleReaction(thought._id, "dislike")}>
              <FaArrowDown className="text-lg" />
            </button>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{thought.user}</p>
            <p>{thought.text}</p>
            <button
              onClick={() => setReplyTo(thought._id)}
              className="text-xs text-blue-500"
            >
              Reply
            </button>
            <button
              onClick={() => toggleCollapse(thought._id)}
              className="text-xs text-blue-500 ml-2"
            >
              {collapsedReplies[thought._id] ? (
                <FaChevronRight />
              ) : (
                <FaChevronDown />
              )}
            </button>
            {replyTo === thought._id && (
              <div className="flex items-center space-x-2 mt-2">
                <textarea
                  className="w-full p-2 rounded-lg border border-gray-300 bg-transparent"
                  value={replyText[thought._id] || ""}
                  onChange={(e) =>
                    handleReplyChange(thought._id, e.target.value)
                  }
                  placeholder="Write a reply..."
                  rows={1}
                />
                <button
                  onClick={() => handlePostReply(thought._id)}
                  className="text-xs text-blue-500"
                >
                  Reply
                </button>
              </div>
            )}
            {!collapsedReplies[thought._id] && (
              <ul className="ml-6 border-l pl-4">
                {renderThoughts(thoughts, thought._id)}
              </ul>
            )}
          </div>
        </li>
      ));

  if (status === "loading" || !conflict) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-background">
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
            <ul className="mt-4 space-y-2">{renderThoughts(thoughts)}</ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
