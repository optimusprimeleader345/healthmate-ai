// Mock WhatsApp + SMS + Panic triggers (frontend only)
export function sendWhatsAppAlert(contact, message) {
  console.log("WhatsApp alert sent to:", contact.phone, message);
  // Real integration: API endpoint to backend → Twilio WhatsApp
}

export function sendSMSAlert(contact, message) {
  console.log("SMS alert sent to:", contact.phone, message);
  // Real SMS integration uses Twilio or MSG91 backend
}

export function broadcastEmergency(contacts, alerts) {
  const message = `⚠️ EMERGENCY ALERT\nIssues detected:\n- ${alerts.join("\n- ")}`;
  contacts.forEach(c => {
    sendWhatsAppAlert(c, message);
    sendSMSAlert(c, message);
  });
}
