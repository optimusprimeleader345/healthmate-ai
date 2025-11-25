import React from 'react';
import { Lock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const PasswordStrengthMeter = ({ password, showDetails = true }) => {
  const calculateStrength = (pwd) => {
    let score = 0;
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      noCommon: !/(password|123456|qwerty|admin|root)/.test(pwd.toLowerCase())
    };

    // Calculate score based on requirements
    if (requirements.length) score += 20;
    if (requirements.uppercase) score += 15;
    if (requirements.lowercase) score += 15;
    if (requirements.numbers) score += 20;
    if (requirements.symbols) score += 15;
    if (requirements.noCommon) score += 15;

    // Bonus for longer passwords
    if (pwd.length >= 12) score += 5;

    return { score: Math.min(score, 100), requirements };
  };

  const getStrengthColor = (score) => {
    if (score < 40) return 'bg-red-500';
    if (score < 60) return 'bg-yellow-500';
    if (score < 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score) => {
    if (score < 40) return { text: 'Very Weak', icon: AlertTriangle, color: 'text-red-600' };
    if (score < 60) return { text: 'Weak', icon: AlertTriangle, color: 'text-orange-600' };
    if (score < 80) return { text: 'Good', icon: Shield, color: 'text-yellow-600' };
    return { text: 'Strong', icon: CheckCircle, color: 'text-green-600' };
  };

  const strength = calculateStrength(password);
  const { score, requirements } = strength;
  const { text, icon: IconComponent, color } = getStrengthText(score);

  if (!password) {
    return (
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Enter password to check strength
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${color}`}>
            <IconComponent className="h-4 w-4" />
            <span className="text-sm font-medium">{text}</span>
          </div>
          <span className="text-sm text-gray-500">{score}/100</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 transition-all duration-300 ${
              score < 40 ? 'bg-red-500' :
              score < 60 ? 'bg-yellow-500' :
              score < 80 ? 'bg-orange-500' :
              'bg-green-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center gap-2 ${requirements.length ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className={`h-3 w-3 flex-shrink-0 ${requirements.length ? 'text-green-600' : 'text-gray-400'}`} />
            <span>At least 8 characters</span>
          </div>

          <div className={`flex items-center gap-2 ${requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className={`h-3 w-3 flex-shrink-0 ${requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`} />
            <span>Uppercase letter</span>
          </div>

          <div className={`flex items-center gap-2 ${requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className={`h-3 w-3 flex-shrink-0 ${requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`} />
            <span>Lowercase letter</span>
          </div>

          <div className={`flex items-center gap-2 ${requirements.numbers ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className={`h-3 w-3 flex-shrink-0 ${requirements.numbers ? 'text-green-600' : 'text-gray-400'}`} />
            <span>Number</span>
          </div>

          <div className={`flex items-center gap-2 ${requirements.symbols ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className={`h-3 w-3 flex-shrink-0 ${requirements.symbols ? 'text-green-600' : 'text-gray-400'}`} />
            <span>Special character</span>
          </div>

          <div className={`flex items-center gap-2 ${requirements.noCommon ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className={`h-3 w-3 flex-shrink-0 ${requirements.noCommon ? 'text-green-600' : 'text-gray-400'}`} />
            <span>Not common password</span>
          </div>
        </div>
      )}

      {/* Password Tips */}
      {score < 80 && password && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
          💡 <strong>Tip:</strong> {score < 40
            ? "Start with a strong base: 8+ characters with mixed letters and numbers"
            : score < 60
            ? "Add special characters (!@#$%^) and ensure length"
            : "Add more complexity or length for maximum security"
          }
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
