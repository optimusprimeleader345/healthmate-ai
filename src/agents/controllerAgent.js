import symptomAgent from './symptomAgent';
import dietAgent from './dietAgent';
import fitnessAgent from './fitnessAgent';
import mentalHealthAgent from './mentalHealthAgent';
import firstAidAgent from './firstAidAgent';
import riskAssessmentAgent from './riskAssessmentAgent';

const controllerAgent = {
  name: 'AI Controller',
  description: 'Routes queries to appropriate health agents based on context and keywords',
  run: (input) => {
    const query = input.toLowerCase();

    // Decision logic based on keywords
    if (query.includes('symptom') || query.includes('pain') || query.includes('sick') || query.includes('ill') || query.includes('headache') || query.includes('stomach')) {
      const result = symptomAgent.run(input);
      return `Symptom Analyzer: ${result}`;
    }
    if (query.includes('diet') || query.includes('food') || query.includes('eat') || query.includes('nutrition') || query.includes('meal') || query.includes('protein')) {
      const result = dietAgent.run(input);
      return `Diet Advisor: ${result}`;
    }
    if (query.includes('exercise') || query.includes('workout') || query.includes('fitness') || query.includes('gym') || query.includes('run') || query.includes('cardio') || query.includes('strength') || query.includes('muscle')) {
      const result = fitnessAgent.run(input);
      return `Fitness Coach: ${result}`;
    }
    if (query.includes('stress') || query.includes('anxiety') || query.includes('depression') || query.includes('sad') || query.includes('sleep') || query.includes('mental') || query.includes('emotion')) {
      const result = mentalHealthAgent.run(input);
      return `Mental Health Companion: ${result}`;
    }
    if (query.includes('burn') || query.includes('cut') || query.includes('bleed') || query.includes('choke') || query.includes('emergency') || query.includes('first')) {
      const result = firstAidAgent.run(input);
      return `First Aid Guide: ${result}`;
    }
    if (query.includes('risk') || query.includes('cancer') || query.includes('diabetes') || query.includes('assess') || query.includes('heart') || query.includes('chest')) {
      const result = riskAssessmentAgent.run(input);
      return `Risk Assessor: ${result}`;
    }

    // Default to symptom agent if no clear match
    const result = symptomAgent.run(input);
    return `Symptom Analyzer: ${result}`;
  }
};

export default controllerAgent;
