import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import AIChatBubble from '../components/AIChatBubble'
import { Send, User, Bot, AlertCircle, Zap, MessageSquare, RefreshCw, Loader2 } from 'lucide-react'
import { openaiHealthService, answerHealthQuestion } from '../services/openaiService'

const AIAssistant = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: `Hello! I'm your AI Health Assistant. I can help you with:

🩺 **Symptom Analysis** - "I have a headache and nausea"
🥗 **Nutrition Guidance** - "What foods help lower cholesterol?"
🏃‍♀️ **Fitness Advice** - "Safe exercises for back pain?"
😴 **Sleep Tips** - "How to improve sleep quality?"
🤔 **General Health Questions** - "What are normal blood pressure levels?"

**Important**: I'm not a substitute for professional medical care. Always consult healthcare providers for specific medical concerns.`,
      timestamp: new Date(),
      isTyping: false
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(`conversation_${Date.now()}`)
  const [apiConfigured, setApiConfigured] = useState(openaiHealthService.isConfigured())
  const [error, setError] = useState('')
  const [typingIndicator, setTypingIndicator] = useState(false)

  // Predefined quick questions for users
  const quickQuestions = [
    "What are symptoms of dehydration?",
    "How can I improve my sleep quality?",
    "What foods help with high blood pressure?",
    "What exercises are safe for beginners?",
    "How to manage stress effectively?"
  ]

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')
    setError('')

    // Add user message immediately
    const userMsg = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: userMessage,
      timestamp: new Date(),
      isTyping: false
    }
    setMessages(prev => [...prev, userMsg])

    // Show typing indicator and loading state
    setTypingIndicator(true)
    setIsLoading(true)

    try {
      // Add a small delay to show the typing indicator
      await new Promise(resolve => setTimeout(resolve, 500))

      // Call OpenAI service
      const response = await openaiHealthService.sendMessage(userMessage, conversationId, {
        userName: 'HealthMate User',
        context: 'AI Health Assistant Chat'
      })

      // Hide typing indicator
      setTypingIndicator(false)

      if (response && response.success) {
        // Add successful bot response
        const botMsg = {
          id: `bot_${Date.now()}`,
          type: 'bot',
          text: response.message || 'Thank you for your question. I\'m here to help with general health and wellness information.',
          timestamp: new Date(),
          isTyping: false
        }
        setMessages(prev => [...prev, botMsg])
      } else {
        // Show error message
        const errorText = response?.error || 'Sorry, I encountered an error. Please try again.'
        const errorMsg = {
          id: `error_${Date.now()}`,
          type: 'error',
          text: errorText,
          timestamp: new Date(),
          isTyping: false
        }
        setMessages(prev => [...prev, errorMsg])
        setError(errorText)
      }

    } catch (err) {
      console.error('Error sending message:', err)

      // Hide typing indicator
      setTypingIndicator(false)

      // Add error message to chat
      const errorMsg = {
        id: `error_${Date.now()}`,
        type: 'error',
        text: 'Sorry, I\'m having trouble connecting right now. This is likely because the OpenAI API key is not configured. Please check your environment settings.',
        timestamp: new Date(),
        isTyping: false
      }
      setMessages(prev => [...prev, errorMsg])
      setError('Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = async (question: string) => {
    setMessage(question)
    await new Promise(resolve => setTimeout(resolve, 100)) // Small delay for state update
    await handleSend()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearConversation = () => {
    setMessages([messages[0]]) // Keep welcome message
    openaiHealthService.clearConversationHistory(conversationId)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2">
          <Zap className={`w-8 h-8 ${apiConfigured ? 'text-blue-500' : 'text-gray-400'}`} />
          <h1 className="text-3xl font-bold text-gray-900">AI Health Assistant</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Get instant health insights and advice from our AI-powered assistant. Ask about symptoms, treatments, or wellness tips.
        </p>

        {/* API Status Indicator */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            apiConfigured
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${apiConfigured ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
            {apiConfigured ? 'GPT-4 Connected' : 'Demo Mode'}
          </div>

          {/* Test button for demo */}
          {!apiConfigured && messages.length === 1 && (
            <button
              onClick={() => handleQuickQuestion("What are symptoms of dehydration?")}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
            >
              Test Demo AI
            </button>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Connection Issue</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Try asking about:
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
                className="px-3 py-2 bg-white rounded-lg border border-blue-200 text-sm text-blue-700 hover:bg-blue-25 hover:border-blue-300 transition-colors disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Chat Panel */}
      <Card className="h-[600px] flex flex-col rounded-2xl shadow-md">
        {/* Header with controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-900">HealthMate AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversation}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <AIChatBubble
              key={msg.id || Math.random()}
              message={msg.text}
              isUser={msg.type === 'user'}
              isAI={msg.type === 'bot'}
              timestamp={msg.timestamp ? msg.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString()}
            />
          ))}

          {/* Typing Indicator */}
          {typingIndicator && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 space-y-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about symptoms, nutrition, fitness, sleep, or general health questions..."
                disabled={isLoading}
                className="w-full h-20 p-3 rounded-xl resize-none border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                rows={4}
              />

              {/* Character count */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Press Enter to send • Shift+Enter for new line</span>
                <span>{message.length}/2000</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSend}
                disabled={!message.trim() || isLoading || message.length > 2000}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Disclaimer */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Medical Disclaimer:</strong> This AI assistant provides general health and wellness information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for personal medical concerns and before making health decisions.
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AIAssistant
