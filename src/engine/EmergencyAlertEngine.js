export function evaluateRiskForEmergency(state) {
  const alerts = [];

  if (Number(state?.heart) > 150) alerts.push("Critical heart rate spike");
  if (Number(state?.stress) > 8) alerts.push("Extreme stress spike");
  if (Number(state?.hydration) < 0.7) alerts.push("Severe dehydration indicator");

  const isEmergency = alerts.length > 0;

  return {
    isEmergency,
    alerts,
    timestamp: Date.now()
  };
}
