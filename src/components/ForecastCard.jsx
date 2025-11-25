import React from 'react'

const ForecastCard = ({ title, trendDirection, confidence, description }) => {
  return (
    <div className="rounded-2xl shadow-md p-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="flex items-center space-x-2 mb-4">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${trendDirection === 'up' ? 'bg-green-100 text-green-800' : trendDirection === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          {trendDirection === 'up' ? 'Trending Up ↑' : trendDirection === 'down' ? 'Trending Down ↓' : 'Stable'}
        </span>
        <span className="text-sm text-teal-600">Confidence: {(confidence * 100).toFixed(0)}%</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

export default ForecastCard
