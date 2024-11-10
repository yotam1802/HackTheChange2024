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
            conflict, // Add conflict parameter here
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
    <div className="flex flex-col items-center justify-center h-full w-full rounded-3xl bg-[#1c1b1b]">
      <div className="flex flex-col w-full shadow-lg rounded-lg h-[40rem]">
        <div className="flex-grow overflow-y-auto p-4">
          <div className="text-center text-gray-400 mb-4">
            Any questions? Get verified AI information here.
          </div>

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
                    ? "bg-gray-500 text-white"
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

          {isTyping && (
            <div className="flex items-center my-2">
              <div className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow text-sm">
                <FontAwesomeIcon icon={faRobot} className="mr-2" />
                The assistant is typing...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center p-2 overflow-y-auto h-36"
        >
          <input
            type="text"
            name="message"
            id="message"
            className="flex-grow px-4 py-2 text-sm bg-transparent border rounded-full outline-none focus:border-primary"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 p-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
