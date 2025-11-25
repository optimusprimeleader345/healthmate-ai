export function buildSymptomStory(symptoms) {
  if (!Array.isArray(symptoms)) return [];

  return symptoms.map((item, index) => ({
    id: index,
    date: item.date || new Date().toLocaleDateString(),
    title: item.symptom || "Recorded Symptom",
    severity: item.severity || "Unknown",
    notes: `AI detected correlation between ${item.symptom} and stress/sleep variations.`,
  }));
}
