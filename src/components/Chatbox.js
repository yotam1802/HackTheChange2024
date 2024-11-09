"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";

import "../globals.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage) {
      const userMessage = {
        role: "user",
        content: newMessage,
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsTyping(true);

      try {
        const response = await fetch("http://localhost:3000/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
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
    <div>
      <div className="flex mx-4 mt-2 text-white h-96 flex-col shadow-2xl rounded-2xl z-50">
        <div id="chat-log" className="flex-grow overflow-y-auto p-2 ">
          <div className="mt-2">
            <p className="ml-4 text-black">
              👋 Say hello! The chatbot is here to help you. If you need help,
              let the chatbot know and the doctor will be alerted.
            </p>
          </div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === "user" ? "message--sent" : "message--received"
              }`}
            >
              <div
                className={`message__text ${
                  msg.role === "user" ? "bg-primary" : "bg-[#2e353d]"
                } my-2 rounded-xl p-1`}
              >
                {msg.role === "user" ? (
                  <>
                    <FontAwesomeIcon icon={faUser} className="mr-2 ml-2" />
                    {msg.content}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRobot} className="mr-2 ml-2" />
                    {msg.content}
                  </>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message message--received">
              <div className="message__text typing text-black">
                The chatbot is typing...
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-shrink-0 p-2 align-middle items-center justify-center text-center solid border-t-2 w-full flex"
        >
          <input
            type="text"
            name="message"
            id="message"
            className="bg-transparent border-b w-full outline-none text-black focus:border-primary text-lg mx-2 mt-2 -translate-y-2 mr-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />

          <button className="sendChat bg-primary cursor-pointer" type="submit">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                </svg>
              </div>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
