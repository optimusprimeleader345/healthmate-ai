const symptomAgent = {
  name: 'Symptom Analyzer',
  description: 'Analyzes user-reported symptoms and provides health insights',
  run: (input) => {
    // Simple logic to analyze input
    const symptoms = input.toLowerCase();
    if (symptoms.includes('headache')) {
      return 'Headache could be due to dehydration, stress, or tension. Consider resting in a quiet room, drinking water, and avoiding screens. If persistent, consult a doctor.';
    }
    if (symptoms.includes('stomach')) {
      return 'Stomach issues may relate to diet, stress, or infection. Try eating bland foods, staying hydrated, and monitoring for other symptoms. Seek medical advice if severe.';
    }
    return 'Please describe your symptoms in more detail for better insights. Common recommendations include resting, hydrating, and consulting a healthcare professional if symptoms worsen.';
  }
};

export default symptomAgent;
