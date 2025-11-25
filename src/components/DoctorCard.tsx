import React from 'react'
import { Card } from './Card'
import { Button } from './Button'

interface DoctorCardProps {
  name: string
  specialty: string
  rating: number
  experience: string
  availability: string
  onBookConsultation?: () => void
  className?: string
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  rating,
  experience,
  availability,
  onBookConsultation,
  className = ''
}) => {
  const renderStars = (rating: number) => {
    return (
      <span className="text-yellow-400">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    )
  }

  return (
    <Card className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
      <div className="space-y-4">
        {/* Picture Placeholder */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-500">👨‍⚕️</span>
          </div>
        </div>

        {/* Name and Specialty */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600">{specialty}</p>
        </div>

        {/* Rating */}
        <div className="flex justify-center">
          <div className="text-center">
            {renderStars(rating)}
          </div>
        </div>

        {/* Experience Badge and Availability */}
        <div className="flex justify-between items-center text-sm">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {experience} years
          </span>
          <span className="text-gray-600">{availability}</span>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-md font-medium transition-all duration-200"
          onClick={onBookConsultation}
        >
          Book Consultation
        </Button>
      </div>
    </Card>
  )
}

export default DoctorCard
