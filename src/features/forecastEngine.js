export function forecastTrend(values) {
  if (!values || values.length === 0) return 0;
  const avg = values.reduce((a,b)=>a+b,0)/values.length;
  return Math.round(avg * 1.08); // simple +8% projection
}
