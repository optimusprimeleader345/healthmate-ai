const riskAssessmentAgent = {
  name: 'Risk Assessor',
  description: 'Evaluates health risks based on symptoms, lifestyle factors, and provides precautionary advice',
  run: (input) => {
    // Analyze for potential risks
    const query = input.toLowerCase();
    if (query.includes('chest pain') || query.includes('heart')) {
      return 'HIGH RISK: Chest pain could indicate a heart issue. Seek immediate medical attention. Do not ignore symptoms like shortness of breath, pain radiating to arm/jaw, or dizziness.';
    }
    if (query.includes('diabetes') || query.includes('blood sugar')) {
      return 'Diabetes risk assessment: Monitor family history, weight, and lifestyle. If you have frequent urination, excessive thirst, or unexplained weight loss, get tested immediately. Preventive measures include balanced diet and regular exercise.';
    }
    if (query.includes('cancer') || query.includes('tumor')) {
      return 'Cancer screening: Regular check-ups and age-appropriate screenings are crucial. Pay attention to unexplained weight loss, persistent fatigue, or unusual lumps. Early detection greatly improves outcomes. Consult your doctor about screening schedules.';
    }
    return 'To assess your health risks, provide more details about your symptoms, family history, or lifestyle factors. Remember, this is not a medical diagnosis - always consult healthcare professionals for personalized risk assessment.';
  }
};

export default riskAssessmentAgent;
