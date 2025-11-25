import React, { useState } from "react";

export default function EmotionalSupportPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    "You’re doing great.",
    "Your feelings matter. Keep going.",
    "Take a breath — you are safe."
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, `You said: ${input}`]);

    // Add supportive AI response
    setMessages((prev) => [
      ...prev,
      "I'm here with you. Remember: you're not alone."
    ]);

    setInput(""); // Correct location outside the array
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Emotional Support AI
      </h3>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share how you feel..."
          className="flex-1 px-3 py-2 rounded-lg border bg-white"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
