const dietAgent = {
  name: 'Diet Advisor',
  description: 'Provides personalized diet recommendations and nutritional insights',
  run: (input) => {
    // Simple analysis based on input
    const query = input.toLowerCase();
    if (query.includes('weight loss')) {
      return 'For weight loss, focus on a balanced diet with calorie deficit, include plenty of vegetables, lean proteins, and whole grains. Aim for portion control and regular exercise. Consult a nutritionist for personalized advice.';
    }
    if (query.includes('protein') || query.includes('muscle')) {
      return 'To build muscle, prioritize protein-rich foods like chicken, fish, eggs, legumes, and nuts. Combine with strength training and adequate calories. Ensure variety in your meals for balanced nutrition.';
    }
    if (query.includes('healthy')) {
      return 'A healthy diet includes diverse fruits, vegetables, whole grains, and lean proteins. Limit processed foods and sugars. Stay hydrated and consider mindful eating practices.';
    }
    return 'Please specify your dietary goals or concerns (e.g., weight loss, gain muscle, healthy eating) for tailored recommendations.';
  }
};

export default dietAgent;
