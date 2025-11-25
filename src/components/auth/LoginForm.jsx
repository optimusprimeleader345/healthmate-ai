import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';

const LoginForm = ({ onLogin, onToggleToRegister, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
