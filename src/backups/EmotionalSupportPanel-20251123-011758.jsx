import React, { useState } from "react";

export default function EmotionalSupportPanel() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi, how are you feeling today? 💙" }
  ]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const user = { from: "user", text };

    const replies = [
      "I'm here for you. You're doing your best.",
      "Your feelings matter. Keep going.",
      "Take a breath — you are safe.",
    setInput("");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border">
      <h3 className="font-semibold text-gray-800">Emotional Support AI 💙</h3>
      <div className="mt-3 space-y-3 max-h-64 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
            <span className={`inline-block px-3 py-2 rounded-xl ${m.from === "user" ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"}`}>{m.text}</span>
          </div>
        ))}
      </div>

      <div className="flex mt-4 gap-2">
        <input className="flex-1 p-2 border rounded-lg" value={input} onChange={e => setInput(e.target.value)} placeholder="Tell me how you feel…" />
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
