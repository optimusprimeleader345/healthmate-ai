import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import FirstAidCategoryCard from '../components/FirstAidCategoryCard'
import {
  Heart,
  AlertTriangle,
  Thermometer,
  Bandage,
  Flame,
  CheckCircle,
  XCircle,
  Siren
} from 'lucide-react'

const FirstAid = () => {
  const [selectedCategory, setSelectedCategory] = useState(0)

  const firstAidCategories = [
    {
      name: 'Cuts & Wounds',
      icon: Bandage,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      steps: [
        'Wash your hands thoroughly with soap and water.',
        'Stop the bleeding by applying pressure with a clean cloth or bandage.',
        'Clean the wound gently with mild soap and water.',
        'Apply antibiotic ointment and cover with a sterile bandage.',
        'Change the bandage daily or when it becomes wet or dirty.'
      ],
      dos: [
        'Keep the wound clean and dry',
        'Monitor for signs of infection like redness, swelling, or fever'
      ],
      donts: [
        'Do not use alcohol, hydrogen peroxide, or iodine to clean the wound',
        'Do not pick at scabs as they heal'
      ],
      warning: 'Seek medical attention for deep wounds, puncture wounds, or if bleeding doesn\'t stop within 10 minutes.'
    },
    {
      name: 'Allergic Reactions',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200',
      steps: [
        'Stay calm and help the person sit or lie down.',
        'Ask about medications, especially if they have an epinephrine auto-injector.',
        'If they have an EpiPen, assist them in using it.',
        'Call emergency services immediately.',
        'Loosen tight clothing and cover them with a blanket if they\'re shivering.'
      ],
      dos: [
        'Remain with the person until help arrives',
        'Help them use their prescribed medications'
      ],
      donts: [
        'Do not give food, drink, or medication by mouth if they\'re having difficulty breathing',
        'Do not ignore mild symptoms as they can worsen quickly'
      ],
      warning: 'Severe allergic reactions (anaphylaxis) are life-threatening emergencies requiring immediate medical attention.'
    },
    {
      name: 'Heat Stroke',
      icon: Thermometer,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      steps: [
        'Move the person to a cool, shady place.',
        'Remove excess clothing and loosen any tight clothing.',
        'Cool the person using whatever means available - fan, cold water spray.',
        'If alert, give them small sips of cool water.',
        'Monitor their temperature and call emergency services.'
      ],
      dos: [
        'Take action immediately if symptoms appear',
        'Stay with the person while cooling them'
      ],
      donts: [
        'Do not give aspirin or paracetamol',
        'Do not leave the person alone'
      ],
      warning: 'Heat stroke is life-threatening. Get medical help immediately if unconsciousness, confusion, or seizures occur.'
    },
    {
      name: 'Cardiac Emergency',
      icon: Heart,
      color: 'bg-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      steps: [
        'Call emergency services immediately.',
        'If the person is conscious, have them sit or lie down with knees bent.',
        'Loosen tight clothing.',
        'If trained and equipped, perform CPR if they\'re not breathing.',
        'Stay with the person until help arrives.'
      ],
      dos: [
        'Begin CPR if trained',
        'Clear the airway if needed'
      ],
      donts: [
        'Do not give the person anything to eat or drink',
        'Do not allow the person to drive themselves'
      ],
      warning: 'Heart attack symptoms require immediate emergency care. Time is critical.'
    }
  ]

  const currentCategory = firstAidCategories[selectedCategory]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">First Aid Guide</h1>
        <p className="text-gray-600 mt-2">
          Emergency response guidelines for common medical situations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="space-y-4">
            {firstAidCategories.map((category, index) => (
              <div key={index} onClick={() => setSelectedCategory(index)}>
                <FirstAidCategoryCard
                  title={category.name}
                  description={
                    category.name === 'Cuts & Wounds' ? 'Treat cuts, wounds, and bandages safely' :
                    category.name === 'Allergic Reactions' ? 'Handle allergic reactions and emergency response' :
                    category.name === 'Heat Stroke' ? 'Manage heat stroke symptoms and cooling' :
                    'Cardiac emergency response steps'
                  }
                  icon={category.icon}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          <Card className="p-6 rounded-2xl shadow-lg">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{currentCategory.name}</h1>

            {/* Steps List */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Emergency Steps
              </h3>
              <ol className="space-y-3">
                {currentCategory.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Do's
                </h3>
                <ul className="space-y-2">
                  {currentCategory.dos.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2 mr-3"></span>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  Don'ts
                </h3>
                <ul className="space-y-2">
                  {currentCategory.donts.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2 mr-3"></span>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Emergency Warning Box */}
            <Card className="p-4 rounded-xl bg-red-50 border-red-200">
              <div className="flex items-start space-x-3">
                <Siren className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Emergency Warning</h4>
                  <p className="text-red-700 text-sm leading-relaxed">{currentCategory.warning}</p>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FirstAid
