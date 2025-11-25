const fitnessAgent = {
  name: 'Fitness Coach',
  description: 'Offers exercise routines, fitness tips, and workout recommendations',
  run: (input) => {
    // Analyze input for fitness-related topics
    const query = input.toLowerCase();
    if (query.includes('beginner') || query.includes('start')) {
      return 'For beginners, start with walking 30 minutes daily, bodyweight exercises like push-ups and squats, and basic stretching. Gradually increase intensity. Always warm up and cool down.';
    }
    if (query.includes('weight loss') || query.includes('cardio')) {
      return 'Cardio exercises like running, cycling, or swimming are great for weight loss. Combine with high-intensity interval training (HIIT) for better results. Maintain consistency and balanced nutrition.';
    }
    if (query.includes('strength') || query.includes('muscle')) {
      return 'For strength training, focus on compound exercises like deadlifts, bench presses, and pull-ups. Aim for 3-4 sessions per week with progressive overload. Don\'t forget rest days and proper form.';
    }
    return 'Describe your fitness goals or current routine for personalized exercise recommendations. Include details like your experience level and any limitations.';
  }
};

export default fitnessAgent;
