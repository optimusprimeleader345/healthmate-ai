import React from 'react'
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const PredictionChart = ({ data, title, unit, color = '#3b82f6' }) => {
  let chartData;
  let gradientId = 'gradient';

  if (Array.isArray(data)) {
    // New simple usage
    chartData = data.map((value, index) => ({
      day: `Day ${index + 1}`,
      value: value
    }));
    unit = unit || '';
  } else {
    // Original complex usage
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const futureDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
    const historical = data.historical?.slice(-7) || []
    const historicalData = historical.map((value, idx) => ({
      day: days[idx],
      value,
      isHistorical: true
    }))
    const forecastData = data.forecast.map((value, idx) => ({
      day: futureDays[idx],
      value,
      lower: data.confidenceLower[idx],
      upper: data.confidenceUpper[idx],
      isHistorical: false
    }))
    chartData = [...historicalData, ...forecastData]
    gradientId = `gradient-${title}`
  }

  return (
    <div className="w-full min-h-[200px]">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {!Array.isArray(data) && <div className="text-sm text-gray-500">
            Accuracy: {(data.accuracy * 100).toFixed(1)}%
          </div>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => {
                if (Array.isArray(data)) {
                  return [`${parseFloat(value).toFixed(1)} ${unit}`, 'Forecast']
                } else {
                  return [
                    `${parseFloat(value).toFixed(1)} ${unit}`,
                    name === 'lower' ? 'Lower Bound' :
                    name === 'upper' ? 'Upper Bound' :
                    name === 'value' && 'Prediction'
                  ]
                }
              }}
              labelFormatter={(label) => `${label}`}
            />
            {!Array.isArray(data) && (
              <>
                {/* Confidence interval area */}
                <Area
                  type="monotone"
                  dataKey="upper"
                  stackId="1"
                  stroke="none"
                  fill={color}
                  fillOpacity={0.1}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stackId="1"
                  stroke="none"
                  fill="#ffffff"
                  connectNulls={false}
                />
              </>
            )}
            {/* Gradient fill for confidence or simple forecast area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={Array.isArray(data) ? `url(#gradient)` : 'transparent'}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#ffffff' }}
              connectNulls={false}
            />
            {!Array.isArray(data) && (
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#ffffff' }}
                connectNulls={false}
              />
            )}
        </AreaChart>
        </ResponsiveContainer>
    </div>
  )
}

export default PredictionChart
