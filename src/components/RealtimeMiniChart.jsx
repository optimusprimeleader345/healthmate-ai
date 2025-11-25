import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const RealtimeMiniChart = ({ data, color }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No data</span>
      </div>
    );
  }
  return (
    <div className="w-full min-h-[200px]">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis hide />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealtimeMiniChart;
