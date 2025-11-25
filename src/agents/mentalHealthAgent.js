const mentalHealthAgent = {
  name: 'Mental Health Companion',
  description: 'Offers mental health support, stress management tips, and emotional well-being advice',
  run: (input) => {
    // Analyze for mental health topics
    const query = input.toLowerCase();
    if (query.includes('stress') || query.includes('anxiety')) {
      return 'For stress and anxiety, try deep breathing exercises, mindfulness meditation, or progressive muscle relaxation. Establish a regular sleep schedule and identify stress triggers. Consider talking to a professional if it feels overwhelming.';
    }
    if (query.includes('depression') || query.includes('sad')) {
      return 'If you\'re feeling depressed or consistently down, reach out to a mental health professional. In the meantime, maintain social connections, engage in physical activity, and practice self-compassion. You\'re not alone in this.';
    }
    if (query.includes('sleep') || query.includes('insomnia')) {
      return 'For better sleep, create a consistent bedtime routine, avoid screens before bed, ensure a dark and quiet sleep environment, and limit caffeine intake. If insomnia persists, consult a healthcare provider.';
    }
    return 'I\'m here to support your mental health journey. Please share what you\'re experiencing so I can provide more targeted guidance. Remember, professional help is important when needed.';
  }
};

export default mentalHealthAgent;
