"use client";

import { useState } from "react";
import { FaUser, FaRobot } from "react-icons/fa";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setReply("");

  
    setChat((prev) => [...prev, { role: "user", text: message }]);
    setMessage("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const aiReply = data.reply || "No reply from AI.";

     
      setChat((prev) => [...prev, { role: "ai", text: aiReply }]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Error occurred while fetching data." },
      ]);
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-100 to-blue-200 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        🌤 News & Weather AI Agent
      </h1>

 
      <div className="border rounded-lg bg-white shadow-lg w-full max-w-lg p-4 flex flex-col">
    
        <div className="flex-1 overflow-y-auto mb-4 space-y-3" style={{ maxHeight: "400px" }}>
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <FaRobot className="text-blue-500 mt-1" size={20} />
              )}
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
              {msg.role === "user" && (
                <FaUser className="text-green-500 mt-1" size={20} />
              )}
            </div>
          ))}
          {loading && <p className="text-gray-500">Thinking...</p>}
        </div>

   
        <div className="flex space-x-2">
        <input
  type="text"
  placeholder="Ask something..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
  className="flex-1 border rounded p-2 focus:outline-none"
/>

          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded shadow hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
