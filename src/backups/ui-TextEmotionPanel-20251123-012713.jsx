import React, { useState } from "react";
import { analyzeTextEmotion } from "../engine/EmotionTextEngine";

export default function TextEmotionPanel() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  function analyze() {
    const analysis = analyzeTextEmotion(input);
    setResult(analysis);

    // Save to history for timeline
    try {
      const prev = JSON.parse(localStorage.getItem("emotionHistory") || "[]");
      prev.push({ text: input, ...analysis, date: new Date().toLocaleString() });
      localStorage.setItem("emotionHistory", JSON.stringify(prev));
    } catch (e) {
      console.error("Emotion save error", e);
    }
  }

  return (
    <div className="mt-10 p-5 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">AI Text Emotion & Stress Analyzer</h2>

      <textarea
        className="w-full border rounded p-3"
        placeholder="Type how you're feeling..."
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={analyze}
      >
        Analyze
      </button>

      {result && (
        <div className="mt-5 p-4 bg-gray-50 border rounded">
          <div><strong>Emotion:</strong> {result.emotion}</div>
          <div><strong>Sentiment:</strong> {result.sentiment}</div>
          <div><strong>Stress Score:</strong> {result.stressScore}</div>
          <div><strong>Summary:</strong> {result.summary}</div>
          <div className="text-sm mt-2 text-gray-600">
            Keywords: {result.keywords.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}
