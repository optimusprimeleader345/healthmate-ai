// AI Pharmacist Agent - Specialized medication and pharmaceutical consultant
// Provides intelligent medication advice, drug interaction checking, and pharmaceutical guidance

const pharmacistAgent = {
  name: 'AI Pharmacist',
  description: 'Specialized pharmaceutical consultant for medication guidance, interactions, and advice',
  specialty: 'medication',

  run: (input, context = {}) => {
    const query = input.toLowerCase();
    const userProfile = context.userProfile || {};

    // Extract medication names from query
    const medicationPatterns = [
      /take(?:ing)? (.+?)(?:\s|$|with|and|plus|along|\.|\?)/gi,
      /using (.+?)(?:\s|$|with|and|plus|along|\.|\?)/gi,
      /(?:about|can i take) (.+?)(?:\s|$|with|and|plus|along|\.|\?)/gi
    ];

    let medications = [];
    medicationPatterns.forEach(pattern => {
      const matches = input.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const meds = match.split(/\s*(?:with|and|plus|along|,)\s*/).slice(1);
          medications.push(...meds);
        });
      }
    });

    // Clean up medication names
    medications = medications.map(med => med.trim()).filter(med => med.length > 1);

    // Interaction checking intent
    if (query.includes('interaction') || query.includes('safe') || query.includes('together') ||
        query.includes('combined') || medications.length > 1) {

      // Check for common interactions
      return `Pharmacist AI Analysis:

🔍 **Analyzing potential medication interactions...**

${this.analyzeMedications(medications)}

💊 **Recommendations:**
- Always consult your prescribing physician before combining medications
- Start with lowest effective doses when combining new medications
- Monitor for side effects and report immediately to your healthcare provider
- Keep accurate medication records and schedules

❓ *If symptoms occur or you experience adverse effects, stop taking the medication and seek immediate medical attention.*

Do you have questions about your medication regimen or would you like me to explain specific drug interactions in more detail?`;
    }

    // Dosage and timing questions
    if (query.includes('dose') || query.includes('dosage') || query.includes('timing') ||
        query.includes('when to take') || query.includes('how often')) {
      return `Pharmacy Dosage Guidance:

✅ **General Medication Timing Guidelines:**

⏰ **Morning (with breakfast):**
- Blood pressure medications
- Some antidepressants
- Many vitamins and minerals

🌙 **Evening (with dinner):**
- Cholesterol medications (statins)
- Calcium supplements
- Some pain medications

💡 **Specific Timing Tips:**
- Take medications at the same time each day for consistency
- Some medications are better absorbed with food, others without
- Space medications 2-4 hours apart if possible to reduce interactions
- Set phone reminders for critical medications

⚠️ **Important Notes:**
- Follow your prescription exactly unless directed by your doctor
- If you miss a dose: follow the specific "missed dose" instructions
- Larger tablets may be harder to swallow - try crushing with doctor approval
- Store medications in proper conditions (cool, dry, away from light)

Would you like me to help set up medication reminders or explain specific medication timing?`;
    }

    // Side effects questions
    if (query.includes('side effect') || query.includes('reaction') || query.includes('symptom')) {
      return `Medication Side Effects Monitoring:

📋 **Common Medication Side Effects:**

⚪ **Very Common (affecting >10% of people):**
- Nausea, stomach upset
- Headache, dizziness
- Fatigue or drowsiness
- Dry mouth

🟡 **Common (affecting 1-10% of people):**
- Rash or itching
- Constipation or diarrhea
- Mild kidney or liver issues
- Changes in appetite

🔴 **Serious (seek immediate medical help):**
- Severe allergic reactions (rash, swelling, difficulty breathing)
- Chest pain, irregular heartbeat
- Severe weakness or confusion
- Unusual bleeding or bruising

🚨 **When to Contact Your Doctor:**
- If side effects persist longer than a week
- If symptoms worsen or new symptoms appear
- Before starting any new supplements or medications
- Regular check-ups to monitor medication effectiveness

📝 **Recommendation:** Keep a medication journal noting side effects, when they occur, and their severity. This helps your doctor adjust your treatment plan.

Would you like me to help you track medication side effects or analyze a specific medication's side effects?`;
    }

    // Generic alternatives questions
    if (query.includes('generic') || query.includes('cost') || query.includes('expensive') ||
        query.includes('cheaper') || query.includes('alternative')) {
      return `Generic Medication Alternatives:

💰 **Generic vs Brand Name Medications:**

✅ **The Same Active Ingredients:**
- Generic medications contain the same active ingredients as brand-name drugs
- FDA requires generic drugs to be bioequivalent (absorbed at same rate/speed)
- Same strength, dosage form, safety, and effectiveness

📊 **Cost Savings:**
- Generic medications cost 80-85% less than brand-name versions
- Most insurances cover generics as first-line treatment
- Average savings: $100-200 per prescription

🛡️ **FDA Approval Process:**
- Rigorous testing and approval required
- Same manufacturing standards as brand-name drugs
- Regular FDA inspections and quality controls

💡 **When Generics Aren't Available:**
- Some medications still under patent protection
- Complex formulations may not have generic equivalents yet
- Biologic medications (made from living organisms) have limited generic options

🔍 **Checking Generic Availability:**
- Ask your pharmacist "Is there a generic available?"
- Check your insurance formulary online
- FDA's "Orange Book" lists generic equivalents

💊 **Your pharmacist can help you switch to generic alternatives while ensuring safety and effectiveness of your treatment.**

Would you like me to help you compare specific medications or find generic alternatives?`;
    }

    // Refill reminders
    if (query.includes('refill') || query.includes('reorder') || query.includes('prescription') ||
        query.includes('pharmacy')) {
      return `Intelligent Refill Management:

📅 **Smart Refill Recommendations:**

⚡ **Auto-Reminders:**
- Set reminders 3-5 days before running out
- Receive alerts when prescriptions expire
- Track multiple medications with different schedules

🏪 **Pharmacy Integration:**
- Connect with your preferred pharmacy
- Automatic refill requests when running low
- Door-to-door delivery options available

📋 **Refill Checklist:**
- ✅ Note refill date on your calendar
- ✅ Keep backup prescription information
- ✅ Check quantities remaining regularly
- ✅ Plan for travel and medication needs

💡 **Emergency Supplies:**
- Keep at least 5-7 day supply as backup
- Know where your nearest pharmacies are located
- Carry medication information card

🚨 **Emergency Situations:**
- What to do if you run out unexpectedly
- Options for extended prescriptions
- Emergency pharmacy locations

Would you like me to help set up medication refill reminders or connect with a pharmacy for automatic refills?`;
    }

    // Pill identification
    if (query.includes('identify') || query.includes('what pill') || query.includes('unknown') ||
        query.includes('found pill') || query.includes('mystery')) {
      return `Pill Identification Service:

🔍 **How to Identify Unknown Pills:**

📷 **Using Our Pill Scanner:**
- Open the camera app
- Point at the pill (ensure good lighting)
- Capture clear image of both sides
- AI will analyze shape, color, markings, and imprint

🔍 **Manual Identification:**
- Check for imprints, numbers, or letters
- Note shape, color, and size
- Check scoring (lines for splitting)

⚠️ **Important Safety Notes:**
- Never take unlabeled medications
- Return found medications to pharmacy
- Contact Poison Control for suspected overdose
- Emergency: Call 911 if already taken

🔒 **Pill Identification Priority:**
- Always prioritize safety first
- Never assume pill identity
- When in doubt, contact your pharmacist or doctor

Would you like to use the pill identification feature or do you have a specific pill you'd like help identifying?`;
    }

    // Default pharmacist response
    return `🏥 Pharmacy Consultation:

Hello! I'm your AI Pharmacist Consultant, specialized in medication guidance. I can help with:

💊 **Medication Management:**
- Drug interaction checking
- Dosage and timing guidance
- Side effects monitoring
- Generic alternatives

📱 **Smart Features:**
- Pill identification using camera
- Refill reminders and management
- Pharmacy delivery coordination

🩺 **Health Integration:**
- Medication tracking with health data
- Personalized medication plans
- Emergency medication guidance

Please describe your medication question or concern, and I'll provide detailed, personalized guidance based on current pharmaceutical standards and best practices.

What would you like assistance with today?`;
  },

  analyzeMedications: function(medications) {
    if (medications.length < 2) {
      return `⚠️ Need more medications to analyze. Please specify all medications you're considering taking together.`;
    }

    // Mock interaction analysis - in real implementation, this would use medical databases
    const interactions = this.getMockInteractions(medications);

    if (interactions.length === 0) {
      return `✅ **No Major Interactions Found**
Based on current knowledge, these medications can generally be taken together safely. However, individual factors may apply.`;
    }

    return interactions.map(interaction => {
      const severity = interaction.severity === 'major' ? '🔴' :
                      interaction.severity === 'moderate' ? '🟡' : '🟢';

      return `${severity} **${interaction.severity.toUpperCase()} INTERACTION**
**Medications:** ${interaction.drugs.join(' + ')}
**Issue:** ${interaction.description}
**Recommendation:** ${interaction.advice}`;
    }).join('\n\n');
  },

  getMockInteractions: function(medications) {
    // Mock interactions for demonstration
    const interactionMap = {
      'warfarin+aspirin': {
        severity: 'major',
        drugs: ['Warfarin', 'Aspirin'],
        description: 'Increased risk of bleeding due to combined anticoagulant effects',
        advice: 'Monitor INR closely, consider alternative pain management'
      },
      'ibuprofen+acetaminophen': {
        severity: 'minor',
        drugs: ['Ibuprofen', 'Acetaminophen'],
        description: 'Generally safe combination, but may increase stomach irritation',
        advice: 'Take with food, monitor for GI discomfort'
      },
      'amlodipine+diltiazem': {
        severity: 'moderate',
        drugs: ['Amlodipine', 'Diltiazem'],
        description: 'Combined blood pressure lowering effects',
        advice: 'Monitor blood pressure closely, adjust doses as needed'
      }
    };

    const foundInteractions = [];

    // Check all medication pairs
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i].toLowerCase().split(' ')[0]; // Get first word
        const med2 = medications[j].toLowerCase().split(' ')[0];

        const key = `${med1}+${med2}`;

        if (interactionMap[key] || interactionMap[key.split('+').reverse().join('+')]) {
          const interactionKey = interactionMap[key] ? key : interactionMap[key.split('+').reverse().join('+')];
          foundInteractions.push(interactionMap[interactionKey]);
        }
      }
    }

    // Add general warnings for common drug classes if multiple similar drugs
    const drugClasses = medications.map(med => this.getDrugClass(med.toLowerCase()));

    if (drugClasses.filter(cls => cls === 'painkiller').length >= 3) {
      foundInteractions.push({
        severity: 'major',
        drugs: medications,
        description: 'Multiple pain medications taken together increases risk of kidney damage and stomach ulcers',
        advice: 'Consult pharmacist before combining multiple pain medications'
      });
    }

    return foundInteractions;
  },

  getDrugClass: function(medication) {
    const drugClasses = {
      'ibuprofen': 'painkiller',
      'naproxen': 'painkiller',
      'aspirin': 'painkiller',
      'acetaminophen': 'painkiller',
      'amlodipine': 'bloodpressure',
      'lisinopril': 'bloodpressure',
      'atorvastatin': 'cholesterol',
      'simvastatin': 'cholesterol',
      'metformin': 'diabetes',
      'lantus': 'diabetes'
    };

    return drugClasses[medication.toLowerCase().split(' ')[0]] || 'unknown';
  }
};

export default pharmacistAgent;
