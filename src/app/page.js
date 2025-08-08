"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setReply("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setReply(data.reply || "No reply from AI.");
    } catch (err) {
      console.error(err);
      setReply("Error occurred while fetching data.");
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center p-6 space-y-6">
      <h1 className="text-2xl font-bold">🌤 News & Weather AI Agent</h1>

      <div className="flex space-x-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>

      {loading && <p className="text-gray-500">Thinking...</p>}

      {reply && (
        <div className="border rounded p-4 bg-gray-50 w-full max-w-md">
          <strong>AI Reply:</strong>
          <p>{reply}</p>
        </div>
      )}
    </main>
  );
}
