import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './Card';

const TrendChart = ({ title, data, dataKey, color, className = '' }) => {
  return (
    <div className="w-full min-h-[200px]">
      <Card className="p-4 h-full bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-md transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default TrendChart;
