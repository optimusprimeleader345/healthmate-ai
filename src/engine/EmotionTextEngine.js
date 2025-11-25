export function analyzeTextEmotion(text) {
  if (!text || text.trim().length === 0) {
    return {
      emotion: "Neutral",
      sentiment: "Neutral",
      stressScore: 0,
      keywords: [],
      summary: "No emotional content detected.",
    };
  }

  const lower = text.toLowerCase();

  let emotion = "Neutral";
  let sentiment = "Neutral";
  let stressScore = 0;

  const keywords = [];

  // Basic emotional word patterns
  if (lower.includes("happy") || lower.includes("excited") || lower.includes("good")) {
    emotion = "Positive";
    sentiment = "Positive";
    keywords.push("positive");
  }

  if (lower.includes("sad") || lower.includes("upset") || lower.includes("down")) {
    emotion = "Sad";
    sentiment = "Negative";
    stressScore += 1;
    keywords.push("sad");
  }

  if (lower.includes("stress") || lower.includes("tired") || lower.includes("anxious")) {
    emotion = "Stressed";
    sentiment = "Negative";
    stressScore += 2;
    keywords.push("stress");
  }

  if (lower.includes("angry") || lower.includes("mad")) {
    emotion = "Angry";
    sentiment = "Negative";
    stressScore += 3;
    keywords.push("anger");
  }

  return {
    emotion,
    sentiment,
    stressScore,
    keywords,
    summary: `Emotion: ${emotion}, Sentiment: ${sentiment}, Stress level estimated.`,
  };
}
