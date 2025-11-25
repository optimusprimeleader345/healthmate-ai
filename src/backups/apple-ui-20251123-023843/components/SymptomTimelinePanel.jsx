import React, { useState, useEffect } from "react";
import TimelineCard from "./TimelineCard";
import { buildSymptomStory } from "../engine/SymptomStoryEngine";

export default function SymptomTimelinePanel() {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("symptomHistory") || "[]");
    const story = buildSymptomStory(saved);
    setTimeline(story);
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">AI Symptom Timeline</h2>
      {timeline.length === 0 ? (
        <div className="text-gray-500">No symptoms recorded yet.</div>
      ) : (
        timeline.map((item) => (
          <TimelineCard key={item.id} {...item} />
        ))
      )}
    </div>
  );
}
