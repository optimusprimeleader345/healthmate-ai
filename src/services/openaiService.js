/**
 * OpenAI GPT Health Assistant Service
 * Provides AI-powered health guidance, symptom analysis, and health insights
 */

class RateLimiter {
  constructor(maxRequestsPerMinute = 20, maxRequestsPerHour = 200) {
    this.maxPerMinute = maxRequestsPerMinute;
    this.maxPerHour = maxRequestsPerHour;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    const oneMinuteAgo = now - (60 * 1000);
    const oneHourAgo = now - (60 * 60 * 1000);

    this.requests = this.requests.filter(timestamp => timestamp > oneHourAgo);

    const requestsInLastMinute = this.requests.filter(timestamp => timestamp > oneMinuteAgo).length;
    const requestsInLastHour = this.requests.length;

    return requestsInLastMinute < this.maxPerMinute && requestsInLastHour < this.maxPerHour;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  getRateLimitStatus() {
    const now = Date.now();
    const oneMinuteAgo = now - (60 * 1000);
    const requestsInLastMinute = this.requests.filter(timestamp => timestamp > oneMinuteAgo).length;

    return {
      used: requestsInLastMinute,
      available: this.maxPerMinute - requestsInLastMinute,
      limit: this.maxPerMinute
    };
  }
}

/**
 * OpenAI GPT Health Assistant Service
 */
export class OpenAIHealthService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4-turbo-preview'; // Latest GPT-4 model

    this.isDemoMode = import.meta.env.VITE_USE_DEMO_MODE === 'true' ||
                     this.apiKey?.startsWith('demo') ||
                     !this.apiKey;

    this.rateLimiter = new RateLimiter(20, 200); // 20 per minute, 200 per hour
    this.maxRetries = 3;
    this.conversationHistory = new Map();
    this.maxHistoryLength = 50;

    this.systemPrompt = this.getSystemPrompt();

    if (this.isDemoMode) {
      console.warn('OpenAI Health Assistant running in demo mode. Using mock responses.');
    }
  }

  /**
   * System prompt with safety guidelines and medical disclaimers
   */
  getSystemPrompt() {
    return `You are HealthMate AI, an advanced AI health assistant designed to provide helpful, accurate, and safe guidance for general health and wellness questions.

CRITICAL SAFETY GUIDELINES:
1. NEVER provide medical diagnosis, treatment, or prescriptions
2. ALWAYS include strong disclaimers about not replacing professional medical care
3. Recommend seeing healthcare providers for serious symptoms or conditions
4. Be conservative with health advice - err on side of safety
5. Direct users to emergency services for urgent situations
6. Clearly state limitations of AI health advice

CAPABILITIES:
- Provide general health information and wellness tips
- Answer questions about nutrition, exercise, and lifestyle
- Analyze reported symptoms and suggest possible general causes (not diagnoses)
- Help understand medical terminology and basic health concepts
- Assist with healthy habit formation and tracking
- Provide evidence-based wellness recommendations
- Offer general stress management and mental wellness tips

RESPONSE FORMAT:
- Be conversational and supportive
- Use clear, simple language
- Include relevant disclaimers
- Focus on education and empowerment
- Suggest professional consultation when appropriate

LIMITATIONS:
- Cannot diagnose conditions or prescribe medications
- Cannot provide emergency care or crisis intervention
- Should not replace licensed healthcare providers
- Information should be used as educational content only`;
  }

  /**
   * Send message to GPT API
   */
  async sendMessage(message, conversationId = 'default', userContext = {}) {
    if (this.isDemoMode) {
      return await this.generateMockResponse(message, userContext);
    }

    if (!this.rateLimiter.canMakeRequest()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please wait before sending more messages.',
        code: 'RATE_LIMIT'
      };
    }

    try {
      this.rateLimiter.recordRequest();

      // Get conversation history
      const history = this.getConversationHistory(conversationId);
      const messages = this.buildMessages(message, history, userContext);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
          user: conversationId // For abuse prevention
        })
      });

      // Handle rate limiting from OpenAI
      if (response.status === 429) {
        return {
          success: false,
          error: 'OpenAI service rate limit reached. Please wait a few minutes.',
          code: 'API_RATE_LIMIT'
        };
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', response.status, errorData);

        // Retry on temporary errors
        if (response.status >= 500 && response.status < 600) {
          return await this.retryWithBackoff(message, conversationId, userContext);
        }

        return {
          success: false,
          error: 'Failed to connect to AI service. Please try again.',
          code: 'API_ERROR'
        };
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Add to conversation history
      this.addToHistory(conversationId, message, aiResponse);

      return {
        success: true,
        message: aiResponse,
        conversationId,
        usage: data.usage
      };

    } catch (error) {
      console.error('OpenAI service error:', error);

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network connection error. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        };
      }

      return {
        success: false,
        error: 'Unexpected error occurred. Please try again.',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Analyze symptoms with AI assistance
   */
  async analyzeSymptoms(symptoms, severity, duration, userContext = {}) {
    if (this.isDemoMode) {
      return await this.generateSymptomAnalysisMock(symptoms, severity, duration);
    }

    const symptomPrompt = `Please analyze these reported symptoms and provide general information:

Symptoms: ${symptoms}
Severity: ${severity}/10
Duration: ${duration}

IMPORTANT: This is NOT a medical diagnosis. I need you to:
1. Provide general information about possible causes (not diagnoses)
2. Suggest when to see a healthcare provider
3. Include strong safety disclaimers
4. Advise on general symptom management (not treatment)
5. Recommend emergency services if symptoms are severe

Format your response as educational information, not medical advice.`;

    return await this.sendMessage(symptomPrompt, `symptom_analysis_${Date.now()}`, userContext);
  }

  /**
   * Provide health insights based on user data
   */
  async generateHealthInsights(userData, healthMetrics = {}) {
    if (this.isDemoMode) {
      return await this.generateHealthInsightsMock(userData, healthMetrics);
    }

    const insightsPrompt = `Based on this user's health data, provide general wellness insights:

User Data: ${JSON.stringify(userData, null, 2)}
Health Metrics: ${JSON.stringify(healthMetrics, null, 2)}

Please provide:
1. General observations about their health trends
2. Basic wellness suggestions
3. General lifestyle improvement ideas
4. Motivational encouragement

IMPORTANT: Do not provide medical advice, only general wellness suggestions with disclaimers.`;

    return await this.sendMessage(insightsPrompt, `insights_${Date.now()}`, { insights: true });
  }

  /**
   * Answer general health questions
   */
  async answerHealthQuestion(question, context = {}) {
    if (this.isDemoMode) {
      return await this.generateHealthAnswerMock(question);
    }

    const questionPrompt = `Please answer this health-related question with general wellness information:

Question: ${question}

Context: ${JSON.stringify(context)}

Guidelines:
- Provide evidence-based general information
- Include safety disclaimers for medical advice
- Suggest professional consultation for specific health concerns
- Focus on education and empowerment
- Be conservative and err on side of safety`;

    return await this.sendMessage(questionPrompt, `question_${Date.now()}`, context);
  }

  /**
   * Get wellness recommendations
   */
  async getWellnessRecommendations(goals, currentHabits = {}) {
    if (this.isDemoMode) {
      return await this.generateWellnessRecommendationMock(goals, currentHabits);
    }

    const recommendationPrompt = `Based on these health goals, provide general wellness recommendations:

Goals: ${goals}
Current Habits: ${JSON.stringify(currentHabits)}

Provide:
1. General habit formation suggestions
2. Basic lifestyle improvements
3. General nutrition recommendations
4. Basic exercise suggestions
5. Stress management tips

IMPORTANT: These are wellness suggestions only, not medical advice. Include appropriate disclaimers.`;

    return await this.sendMessage(recommendationPrompt, `recommendation_${Date.now()}`, { goals });
  }

  /**
   * Helper Methods
   */
  buildMessages(userMessage, history, userContext) {
    const messages = [
      {
        role: 'system',
        content: this.systemPrompt
      }
    ];

    // Add user context if available
    if (Object.keys(userContext).length > 0) {
      messages.push({
        role: 'system',
        content: `User context: ${JSON.stringify(userContext)}`
      });
    }

    // Add conversation history
    history.slice(-10).forEach(msg => { // Keep last 10 exchanges
      messages.push({ role: 'user', content: msg.user });
      messages.push({ role: 'assistant', content: msg.assistant });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  getConversationHistory(conversationId) {
    return this.conversationHistory.get(conversationId) || [];
  }

  addToHistory(conversationId, userMessage, assistantMessage) {
    if (!this.conversationHistory.has(conversationId)) {
      this.conversationHistory.set(conversationId, []);
    }

    const history = this.conversationHistory.get(conversationId);
    history.push({
      user: userMessage,
      assistant: assistantMessage,
      timestamp: Date.now()
    });

    // Limit history length
    if (history.length > this.maxHistoryLength) {
      history.splice(0, history.length - this.maxHistoryLength);
    }
  }

  async retryWithBackoff(message, conversationId, userContext, attempt = 1) {
    if (attempt > this.maxRetries) {
      return {
        success: false,
        error: 'Service temporarily unavailable. Please try again later.',
        code: 'SERVICE_UNAVAILABLE'
      };
    }

    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000)); // Exponential backoff
    return await this.sendMessage(message, conversationId, userContext, attempt + 1);
  }

  /**
   * Mock Response Generators (for demo mode)
   */
  async generateMockResponse(message, context) {
    console.log('[Demo Mode] Processing message:', message);

    // Add delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('ache')) {
      return await this.generateSymptomAnalysisMock(message, 'moderate', '2-3 days');
    }

    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return await this.generateNutritionResponseMock(message);
    }

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
      return await this.generateExerciseResponseMock(message);
    }

    return await this.generateGeneralHealthResponseMock(message);
  }

  async generateSymptomAnalysisMock(symptoms, severity, duration) {
    return {
      success: true,
      message: `Based on the symptoms you described (${symptoms}), here are some general observations:

⏰ **What you described**: ${severity}/10 severity, lasting ${duration}

🏥 **General information**: Symptoms like these can have various causes including temporary conditions, stress, hydration, or environmental factors. It's always important to monitor symptoms carefully.

⚠️ **Important disclaimers**:
• This is NOT medical advice or diagnosis
• I cannot assess your specific symptoms
• Please consult a healthcare provider for proper evaluation

📋 **General wellness suggestions**:
• Stay hydrated and rest as needed
• Monitor symptoms and note any changes
• Keep detailed records of onset, location, and triggers

🚨 **When to seek professional care**:
• If symptoms worsen significantly
• If you experience severe pain, difficulty breathing, or chest pain
• If symptoms persist longer than expected

Please seek professional medical evaluation for proper assessment and care. Your health and safety are the top priority!`,
      conversationId: 'mock_symptom_' + Date.now()
    };
  }

  async generateNutritionResponseMock(question) {
    return {
      success: true,
      message: `Based on nutrition science and general health guidelines, here's some general wellness information:

🍎 **Nutrition principles**:
• Focus on whole foods when possible
• Balance macronutrients (proteins, carbs, healthy fats)
• Prioritize vegetables, fruits, whole grains, and lean proteins
• Stay adequately hydrated

💡 **General tips**:
• Listen to your hunger cues
• Include variety in your diet
• Consider nutrient-dense foods like leafy greens, berries, nuts, and fish
• Limit processed foods and added sugars

⚠️ **Important note**: This is general wellness information, not personalized nutrition advice. For specific dietary needs, allergies, or medical conditions, consult with a registered dietitian or healthcare provider.

Would you like me to elaborate on any nutritional quest or provide general recipe ideas?`,
      conversationId: 'mock_nutrition_' + Date.now()
    };
  }

  async generateExerciseResponseMock(question) {
    return {
      success: true,
      message: `Here's some general wellness information about exercise and physical activity:

🏃‍♀️ **General guidelines**:
• Aim for at least 150 minutes of moderate aerobic activity per week
• Include strength training 2-3 times per week
• Start gradually and build up gradually
• Listen to your body and rest when needed

🎯 **Activity types**:
• Walking, swimming, cycling (cardiovascular)
• Weight training, bodyweight exercises (strength)
• Yoga, stretching (flexibility and recovery)
• Team sports or classes (social and varied)

⚠️ **Safety considerations**:
• Consult your doctor before starting new exercise programs
• Especially important if you have health conditions
• Stop if you experience pain (beyond normal muscle soreness)
• Use proper form to prevent injury

This is general wellness information. A certified personal trainer or healthcare provider can help create a personalized exercise plan for your specific needs and fitness level.`,
      conversationId: 'mock_exercise_' + Date.now()
    };
  }

  async generateGeneralHealthResponseMock(question) {
    return {
      success: true,
      message: `I'm HealthMate AI, your wellness companion. I'm here to provide general health and wellness information, but I cannot provide medical advice or diagnosis.

💬 About your question: I understand you're asking about health topics. Here's some general wellness information that may be helpful:

🏥 **Healthcare reminder**:
If you're dealing with specific health conditions, symptoms, or treatment decisions, please consult with licensed healthcare providers who can provide personalized, professional care.

📚 **Wellness resources**:
• Focus on healthy diet, regular activity, and good sleep
• Practice stress management techniques
• Maintain regular health check-ups
• Stay informed about reputable health information sources

🤝 **How I can help**:
• Provide general wellness education
• Suggest healthy lifestyle habits
• Help you understand basic health concepts
• Motivate healthy choices

For personalized medical advice, diagnosis, or treatment, please consult with qualified healthcare professionals. Your health is too important to rely on AI guidance alone!

What specific wellness topics would you like to learn more about?`,
      conversationId: 'mock_general_' + Date.now()
    };
  }

  async generateHealthAnswerMock(question) {
    const lowerQuestion = question.toLowerCase();
    let response = '';

    if (lowerQuestion.includes('blood pressure')) {
      response = `Blood pressure is the force of blood against your artery walls. Here are some general wellness concepts:

📊 **Understanding numbers**: 
• Normal: <120/80 mmHg
• Elevated: 120-129/80-89 mmHg  
• High: ≥130/90 mmHg

💡 **General lifestyle factors**:
• Maintain a healthy weight
• Regular physical activity
• Balanced nutrition (DASH diet)
• Reduced sodium intake
• Limited alcohol and caffeine
• Stress management

⚠️ **Medical monitoring**: Regular blood pressure checks and medical supervision are essential. This is general information only - consult your healthcare provider for personal assessment.

Would you like information about other health topics?`;
    } else {
      response = await this.generateGeneralHealthResponseMock(question).message;
    }

    return {
      success: true,
      message: response,
      conversationId: 'mock_answer_' + Date.now()
    };
  }

  async generateWellnessRecommendationMock(goals, currentHabits) {
    return {
      success: true,
      message: `Based on your wellness goals, here are some general lifestyle suggestions:

${goals ? `🎯 **Your goals**: ${goals}` : ''}

💡 **General wellness recommendations**:

🏃‍♀️ **Movement**:
• Aim for daily physical activity you enjoy
• Combine cardio, strength, and flexibility exercises
• Take walking breaks during the day

🥗 **Nutrition habits**:
• Focus on whole foods when possible
• Include vegetables and fruits in meals
• Stay hydrated throughout the day

😴 **Rest & recovery**:
• Aim for consistent sleep patterns
• Practice relaxation techniques
• Take intentional breaks from screens

🌱 **Habit formation**:
• Start with small, sustainable changes
• Track progress gradually
• Be kind to yourself during the process

⚠️ **Important reminder**: This is general wellness advice, not personalized medical recommendations. Your healthcare provider can offer guidance tailored to your individual health needs and conditions.

What specific habits would you like to work on first?`,
      conversationId: 'mock_recommendation_' + Date.now()
    };
  }

  async generateHealthInsightsMock(userData, healthMetrics) {
    return {
      success: true,
      message: `Here's a general wellness overview based on common health patterns:

📊 **Wellness observations**:
• Consistency is often more important than perfection
• Small, sustainable habits lead to lasting change
• Rest and recovery support long-term progress
• Each person's journey is unique

🌟 **General insights**:
• Regular physical activity supports overall health
• Balanced nutrition provides energy and nutrients
• Quality sleep enhances recovery and mental well-being
• Stress management techniques can improve resilience

🎯 **Wellness suggestions**:
• Focus on activities you genuinely enjoy
• Build sustainable daily habits
• Track progress without being overly rigid
• Celebrate non-scale victories

Remember, this is general wellness information. For personalized health insights, consult with healthcare professionals who have access to your complete medical information.

What aspects of wellness are most important to you right now?`,
      conversationId: 'mock_insights_' + Date.now()
    };
  }

  /**
   * Utility methods
   */
  clearConversationHistory(conversationId) {
    this.conversationHistory.delete(conversationId);
  }

  clearAllHistory() {
    this.conversationHistory.clear();
  }

  getRateLimitStatus() {
    return this.rateLimiter.getRateLimitStatus();
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }
}

// Export singleton instance
export const openaiHealthService = new OpenAIHealthService();

// Export symptom analysis wrapper for easier use
export const analyzeSymptoms = (symptoms, severity, duration, context = {}) => {
  return openaiHealthService.analyzeSymptoms(symptoms, severity, duration, context);
};

export const generateHealthInsights = (userData, healthMetrics = {}) => {
  return openaiHealthService.generateHealthInsights(userData, healthMetrics);
};

export const answerHealthQuestion = (question, context = {}) => {
  return openaiHealthService.answerHealthQuestion(question, context);
};

export const getWellnessRecommendations = (goals, currentHabits = {}) => {
  return openaiHealthService.getWellnessRecommendations(goals, currentHabits);
};

// Export error types
export const HEALTH_AI_ERRORS = {
  API_ERROR: 'API_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export default openaiHealthService;
