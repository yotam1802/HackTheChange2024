"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faRobot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../app/globals.css";

const Chatbox = ({ conflict }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage) {
      const userMessage = { role: "user", content: newMessage };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsTyping(true);

      try {
        const response = await fetch("http://localhost:3000/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            conflict,
          }),
        });
        const data = await response.json();
        const assistantMessage = {
          role: "assistant",
          content: data.completion,
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl p-6">
      <div className="flex flex-col w-full rounded-lg h-[40rem] bg-opacity-90 bg-[#2a2a2a] border border-gray-600 overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 relative">
          {/* Centered message for no messages */}
          {messages.length === 0 && !isTyping && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-center text-gray-300 text-2xl font-semibold p-6">
                Any questions? <br /> Get verified AI information here.
              </p>
            </div>
          )}

          {/* Message history */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-center my-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-center px-4 py-2 rounded-lg shadow ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <FontAwesomeIcon
                  icon={msg.role === "user" ? faUser : faRobot}
                  className="mr-2"
                />
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center my-2">
              <div className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow text-sm">
                <FontAwesomeIcon icon={faRobot} className="mr-2" />
                The assistant is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input field */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center p-2 border-t border-gray-600 bg-[#1f1f1f] h-16"
        >
          <input
            type="text"
            name="message"
            id="message"
            className="flex-grow px-4 py-2 text-sm text-white bg-[#2e2e2e] border border-gray-600 rounded-full outline-none focus:border-blue-500 placeholder-gray-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 p-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
