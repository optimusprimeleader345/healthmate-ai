export function generateDailyRecommendations(data) {
  return [
    { title: "Hydration Goal", message: `Aim for ${(data.hydration || 2.7)}L today.`, icon: "💧" },
    { title: "Sleep Target", message: `Try for ${(data.sleep || 7.5)} hours tonight.`, icon: "😴" },
    { title: "Stress Care", message: "Midday stress expected — try 3 deep breaths.", icon: "🧘" }
  ];
}
