import React from 'react';

export default function CircularRing({ size = 96, thickness = 12, value = 70, color = '#14B8A6' }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value/100)*c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stopColor={color} /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(0,0,0,0.06)" strokeWidth={thickness} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke="url(#g)" strokeWidth={thickness} fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
}
