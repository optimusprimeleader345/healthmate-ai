const firstAidAgent = {
  name: 'First Aid Guide',
  description: 'Provides immediate first aid advice and emergency response guidance',
  run: (input) => {
    // Analyze for emergency situations
    const query = input.toLowerCase();
    if (query.includes('burn')) {
      return 'For burns: Cool the burn with running water for 20 minutes. Cover with sterile dressing. Do not use creams. For severe burns, seek immediate medical help. REMEMBER: Seek professional medical help for any emergency situation.';
    }
    if (query.includes('cut') || query.includes('bleed')) {
      return 'For cuts and bleeding: Apply direct pressure with a clean cloth. Keep the wound above heart level if possible. Clean with soap and water after bleeding stops. Cover with bandage. Seek medical attention for deep wounds or heavy bleeding.';
    }
    if (query.includes('choke') || query.includes('breathing')) {
      return 'If someone is choking: Perform abdominal thrusts (Heimlich maneuver) if they can\'t breathe. For children, use different techniques. Call emergency services immediately. Do not delay - act quickly in emergencies.';
    }
    return 'For immediate first aid advice, describe the situation clearly. Important: This is not a substitute for professional medical care. Always call emergency services for serious situations and seek medical attention when appropriate.';
  }
};

export default firstAidAgent;
