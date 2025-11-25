import React, { useState } from 'react';
import { X, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import EmailService from '../../services/EmailService';

const ForgotPasswordForm = ({ onClose, onSuccess, onOtpRequested }) => {
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Email input, 2: Verification sent

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const validateEmails = () => {
    const { email, confirmEmail } = formData;

    if (!email.trim()) {
      setError('Email address is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (confirmEmail && email !== confirmEmail) {
      setError('Email addresses do not match');
      return false;
    }

    // Check if account exists (simulate for demo)
    const validEmails = [
      'admin@healthmate.com',
      'patient@example.com',
      'demo.patient@healthmate.com',
      'user123@example.com',
      'doctor.wang@clinic.cn'
    ];

    if (!validEmails.includes(email.toLowerCase())) {
      setError('No account found with this email address. Please check and try again.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmails()) return;

    setLoading(true);
    setError('');

    try {
      // Send reset email
      const result = await EmailService.sendPasswordReset(formData.email);

      if (result.success) {
        setSuccess(true);
        setStep(2);

        // Call parent callback with OTP
        if (onOtpRequested) {
          onOtpRequested(formData.email, result.otp);
        }

        // Auto-close after success message
        setTimeout(() => {
          if (onClose) onClose();
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStep(1);
    setSuccess(false);
    setError('');
    setFormData({ email: '', confirmEmail: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full">
        <Card className="p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="text-gray-600 text-sm mt-1">
              {step === 1
                ? "Enter your email address and we'll send you a reset link."
                : "Password reset email has been sent!"
              }
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              {/* Confirm Email */}
              <div>
                <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Email Address
                </label>
                <Input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  placeholder="Confirm your email"
                  className="w-full"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Reset Email...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    Send Reset Email
                  </div>
                )}
              </Button>
            </form>
          )}

          {step === 2 && success && (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-green-800 font-medium mb-2">Reset Email Sent!</h3>
                <p className="text-green-700 text-sm">
                  We've sent a password reset link to <strong>{formData.email}</strong>.
                  Check your email and follow the instructions to reset your password.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder or
                  <button
                    onClick={handleRetry}
                    className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                  >
                    try again
                  </button>
                </p>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={onClose}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
