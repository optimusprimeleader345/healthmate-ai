import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, User, Lock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isDemoMode } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;

      if (isDemoMode) {
        // In demo mode, simulate successful auth and navigate
        setTimeout(() => {
          if (isSignUp) {
            // For signup, just confirm account creation
            alert(`Account created successfully for ${formData.email}!`);
            setIsSignUp(false); // Switch back to sign in
          } else {
            // Set simulated user profile in localStorage for demo mode
            const demoProfile = {
              displayName: formData.email.split('@')[0],
              role: formData.email === 'admin@healthmate.com' ? 'admin' : formData.role,
              lastLogin: new Date().toISOString(),
              subscription: 'premium'
            };
            localStorage.setItem('healthmate-demo-user', JSON.stringify(demoProfile));

            // Navigate to appropriate dashboard based on role or email
            if (formData.role === 'admin' || formData.email === 'admin@healthmate.com') {
              navigate('/admin/dashboard');
            } else {
              navigate('/dashboard');
            }
          }
        }, 1000);
      } else {
        // Production mode - use real auth
        if (isSignUp) {
          result = await signUp(formData.email, formData.password, {
            displayName: formData.email.split('@')[0],
            role: formData.role
          });
        } else {
          result = await signIn(formData.email, formData.password);
        }

        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAccounts = [
    { email: 'admin@healthmate.com', password: 'admin123', role: 'Admin' },
    { email: 'patient@example.com', password: 'patient123', role: 'Patient' },
    { email: 'demo.patient@healthmate.com', password: 'demo', role: 'Demo Patient' }
  ];

  const handleTestLogin = async (account) => {
    if (isDemoMode) {
      // In demo mode, simulate authentication and navigate to appropriate dashboard based on role
      setTimeout(() => {
        // Set simulated user profile in localStorage for demo mode
        const demoProfile = {
          displayName: account.email.split('@')[0],
          role: account.role.toLowerCase(),
          lastLogin: new Date().toISOString(),
          subscription: 'premium'
        };
        localStorage.setItem('healthmate-demo-user', JSON.stringify(demoProfile));

        if (account.role.toLowerCase() === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 100);
    } else {
      // Production mode - set role in form data for actual auth
      setFormData({
        email: account.email,
        password: account.password,
        role: account.role.toLowerCase()
      });
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Join your health journey' : 'Sign in to access your health dashboard'}
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                    formData.role === 'patient'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    Patient
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                    formData.role === 'admin'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </div>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your secure password"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing in...'}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </div>
              )}
            </Button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"
                }
              </button>
            </div>
          </form>
        </Card>

        {/* Demo Accounts */}
        {!isSignUp && (
          <Card className="p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {testAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleTestLogin(account)}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{account.role}</div>
                    <div className="text-xs text-gray-500">{account.email}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Click any account to auto-fill login credentials
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
